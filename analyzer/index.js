const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { VertexAI } = require('@google-cloud/vertexai');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const storage = new Storage();

// Initialize Vertex AI
const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || 'cybersentry-app';
const location = 'us-central1';
const vertexAiOptions = { project: project, location: location };
const vertexAI = new VertexAI(vertexAiOptions);

app.post('/analyze', async (req, res) => {
    const { fileId, bucket } = req.body;
    if (!fileId || !bucket) return res.status(400).json({ error: 'Missing fileId or bucket' });

    const apkPath = `/tmp/${fileId}.apk`;
    const outDir = `/tmp/${fileId}_out`;

    try {
        console.log(`Downloading gs://${bucket}/${fileId}.apk...`);
        await storage.bucket(bucket).file(`${fileId}.apk`).download({ destination: apkPath });

        console.log(`Extracting ${apkPath} with apktool...`);
        // Extracting only manifest to save time, or full decode if needed
        execSync(`apktool d ${apkPath} -s -o ${outDir} -f`); // -s prevents decoding sources, speeds up massively if we only want manifest

        console.log(`Reading AndroidManifest.xml...`);
        const manifestPath = path.join(outDir, 'AndroidManifest.xml');
        let manifestContent = '';
        if (fs.existsSync(manifestPath)) {
            manifestContent = fs.readFileSync(manifestPath, 'utf8');
        } else {
            throw new Error('AndroidManifest.xml not found after extraction');
        }

        console.log(`Sending to Gemini for analysis...`);
        // Using getGenerativeModel preview wrapper
        const generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-3.1-flash-lite-preview'
        });

        const prompt = `
        You are an expert mobile security researcher. Please perform a static security analysis of the following AndroidManifest.xml file.
        Look for:
        1. Dangerous or excessive permissions.
        2. Exported components (activities, services, receivers, providers) that might lack proper intent-filters or permissions.
        3. Cleartext traffic allowed (usesCleartextTraffic).
        4. Debuggable flag set to true.
        5. Any abnormal configurations commonly used by malware.
        
        Provide a structured, easy-to-read report in Markdown format highlighting High/Medium/Low risks. Keep the report user friendly but highly technical.
        
        AndroidManifest.xml Content:
        \`\`\`xml
        ${manifestContent}
        \`\`\`
        `;

        const resp = await generativeModel.generateContent(prompt);
        const report = resp.response.candidates[0].content.parts[0].text;

        console.log(`Analysis complete for ${fileId}`);
        res.json({ success: true, report: report });

    } catch (err) {
        console.error('Error during analysis:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    } finally {
        // Cleanup
        console.log(`Cleaning up files for ${fileId} ...`);
        try { if (fs.existsSync(apkPath)) fs.unlinkSync(apkPath); } catch(e){}
        try { if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true }); } catch(e){}
        
        // delete from GCS to save space
        try { await storage.bucket(bucket).file(`${fileId}.apk`).delete(); } catch(e){}
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Analyzer Service listening on port ${port}`);
});
