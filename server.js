const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like the index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced HTML wrapper with course UI navigation
const renderLesson = (contentHtml, title, currentModuleNum) => {
    // Navigation Logic
    const nextBtn = currentModuleNum < 5
        ? `<a href="/course/module-${currentModuleNum + 1}" class="nav-btn glow-bg" data-i18n="nav_next">Next Module →</a>`
        : `<a href="/" class="nav-btn glow-bg" data-i18n="nav_finish">Finish Course 🎉</a>`;

    const prevBtn = currentModuleNum > 1
        ? `<a href="/course/module-${currentModuleNum - 1}" class="nav-btn" data-i18n="nav_prev">← Previous</a>`
        : `<a href="/" class="nav-btn" data-i18n="nav_dashboard">← Course Dashboard</a>`;

    const progressPercent = (currentModuleNum / 5) * 100;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Cyber Course</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0d1117;
            --surface-color: #161b22;
            --border-color: #30363d;
            --text-primary: #e6edf3;
            --text-secondary: #8b949e;
            --accent-cyan: #58a6ff;
            --accent-purple: #bc8cff;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.7;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        
        .page-container {
            display: flex;
            min-height: 100vh;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .main-content {
            flex: 1;
            padding: 3rem 6%;
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
        }
        
        .sidebar {
            width: 300px;
            background: var(--surface-color);
            border-left: 1px solid var(--border-color);
            padding: 3rem 2rem;
            position: sticky;
            top: 0;
            height: 100vh;
            box-sizing: border-box;
            overflow-y: auto;
        }

        @media (max-width: 900px) {
            .page-container { flex-direction: column; }
            .sidebar { width: 100%; height: auto; border-left: none; border-top: 1px solid var(--border-color); position: static; padding: 2rem 5%; }
            .main-content { padding: 2rem 5%; }
        }
        
        h1, h2, h3, h4 { 
            font-family: inherit; 
            color: var(--text-primary);
            margin-top: 2em;
            margin-bottom: 0.75em;
            font-weight: 600;
        }
        h1 { font-size: 2.25rem; margin-top: 0; font-weight: 700; color: #fff; border-bottom: none; }
        h2 { font-size: 1.5rem; color: #fff; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
        h3 { font-size: 1.25rem; }
        p { margin-bottom: 1.25em; font-size: 1.05rem; }
        ul, ol { margin-bottom: 1.25em; padding-left: 1.5rem; font-size: 1.05rem; }
        li { margin-bottom: 0.5em; }
        
        code { background: var(--surface-color); padding: 0.2em 0.4em; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, monospace; color: var(--accent-cyan); font-size: 0.9em; }
        pre { background: var(--surface-color); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); overflow-x: auto; margin: 1.5rem 0; line-height: 1.5; }
        pre code { color: var(--text-primary); background: transparent; padding: 0; border: none; }
        a { color: var(--accent-cyan); text-decoration: none; }
        a:hover { text-decoration: underline; }
        blockquote { border-left: 4px solid var(--accent-cyan); margin: 1.5rem 0; color: var(--text-secondary); background: rgba(88, 166, 255, 0.05); padding: 1rem 1rem 1rem 1.25rem; border-radius: 0 8px 8px 0; }
        
        table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem; }
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
        th { font-weight: 600; color: #fff; background: rgba(255,255,255,0.03); }

        /* Top Navigation */
        .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .back-link { color: var(--text-secondary); text-decoration: none; font-weight: 500; font-size: 0.95rem; }
        .back-link:hover { color: var(--text-primary); text-decoration: none; }
        .module-badge { color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
        
        /* Bottom Navigation */
        .bottom-nav { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; }
        .nav-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1.2rem; border-radius: 6px; border: 1px solid var(--border-color); color: var(--text-primary); font-weight: 500; text-decoration: none; transition: all 0.2s ease; background: var(--surface-color); font-size: 0.95rem; }
        .nav-btn:hover { background: #21262d; border-color: #8b949e; text-decoration: none; }
        .glow-bg { background: var(--text-primary); color: var(--bg-color); border: none; font-weight: 600; }
        .glow-bg:hover { background: #ffffff; color: var(--bg-color); border: none; }
        
        /* Sidebar Styling */
        .sidebar h3 { font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; margin-top: 0; border: none; padding: 0; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.4rem; }
        .sidebar-link {
            padding: 0.6rem 1rem;
            border-radius: 6px;
            color: var(--text-secondary);
            text-decoration: none !important;
            transition: all 0.2s;
            font-size: 0.95rem;
            display: block;
        }
        /* Translator overrides */
        .goog-te-gadget { color: var(--text-secondary) !important; font-family: inherit !important; font-size: 0.85rem !important; }
        .goog-te-gadget .goog-te-combo { background: var(--surface-color); color: var(--text-primary); border: 1px solid var(--border-color); padding: 4px; border-radius: 4px; outline: none; margin-left: 8px; }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="main-content">
            <div class="top-nav">
                <a href="/" class="back-link" data-i18n="nav_dashboard">← Course Dashboard</a>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <select id="lang-switcher" onchange="changeLang(this.value)" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 4px; border-radius: 4px; outline: none; font-family: inherit; font-size: 0.85rem;">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="kn">ಕನ್ನಡ</option>
                    </select>
                    <div class="module-badge">Module ${currentModuleNum}</div>
                </div>
            </div>
            
            ${contentHtml}
            
            <div class="bottom-nav">
                ${prevBtn}
                ${nextBtn}
            </div>
        </div>
        
        <aside class="sidebar">
            <h3 data-i18n="sidebar_title">Course Modules</h3>
            <nav class="sidebar-nav">
                <a href="/course/module-1" class="sidebar-link ${currentModuleNum === 1 ? 'active' : ''}">01. Introduction to AI</a>
                <a href="/course/module-2" class="sidebar-link ${currentModuleNum === 2 ? 'active' : ''}">02. The Evolving Landscape</a>
                <a href="/course/module-3" class="sidebar-link ${currentModuleNum === 3 ? 'active' : ''}">03. Specialized AI Tools</a>
                <a href="/course/module-4" class="sidebar-link ${currentModuleNum === 4 ? 'active' : ''}">04. Mobile APK Analysis</a>
                <a href="/course/module-5" class="sidebar-link ${currentModuleNum === 5 ? 'active' : ''}">05. Custom Deployed Solutions</a>
            </nav>
        </aside>
    </div>
    
    <script src="/i18n.js"></script>
</body>
</html>
`;
};

// Dynamic route for fetching MD files based on module ID
app.get('/course/:moduleName', (req, res) => {
    const moduleName = req.params.moduleName; // e.g., 'module-1'
    const lang = req.query.lang || 'en';
    
    const filename = lang === 'en' ? `${moduleName}.md` : `${moduleName}-${lang}.md`;
    let filePath = path.join(__dirname, 'content', filename);
    
    // Fallback to english if localized markdown doesn't exist
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'content', `${moduleName}.md`);
    }

    // Parse the module number out of the URL (e.g., 'module-1' -> 1)
    const moduleParts = moduleName.split('-');
    const currentModuleNum = moduleParts.length > 1 ? parseInt(moduleParts[1], 10) : 0;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${filePath}:`, err);
            return res.status(404).send(renderLesson('<h1>404 - Module Not Found</h1><p>Sorry, the course module you are looking for does not exist.</p>', 'Not Found', 0));
        }

        // Convert Markdown to HTML
        const contentHtml = marked.parse(data);
        const friendlyTitle = moduleName.replace('-', ' ').toUpperCase();

        res.send(renderLesson(contentHtml, friendlyTitle, currentModuleNum));
    });
});

app.listen(PORT, () => {
    console.log(`Course engine running successfully at http://localhost:${PORT}`);
});
