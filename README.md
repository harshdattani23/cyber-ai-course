# 🕵️ Sovereign DFIR | Mobile Malware AI Analyzer

Sovereign DFIR is a hyper-advanced, automated Digital Forensics and Incident Response (DFIR) static analysis engine. 
Built with an integrated Node.js Cloud Run backend and a Premium Glassmorphism AI UI frontend, the architecture seamlessly decompiles Android applications, maps and extracts their entire internal Java/Dalvik codebase, and streams the intelligence securely to **Gemini 3.1 Flash Preview** for elite Threat Intelligence breakdown.

## ✨ Features
* **Full-Codebase Extraction:** Dynamically utilizes \`apktool\` to structurally rip and unpack both the core Android manifest and the underlying compiled Java/Dalvik classes (Smali).
* **Smart Boilerplate Evasion Filter:** Automatically identifies and strips massive 3rd-party generic frameworks (\`androidx\`, \`com/google\`, \`kotlin/\`) from the payload to preserve the 1,000,000 token AI boundary entirely for the original core operational logic.
* **Native Anti-Analysis Sandbox Detector:** Hardened backend structures intercept malformed ZIP Central Directory (CEN) headers (e.g. invalid \`8314\` compression methods) used by highly-sophisticated malware to intentionally crash decompilers, automatically bypassing the AI entirely to deliver an instant **100% Confidence Forensic Alert**.
* **Glassmorphism Markdown Engine:** The Next.js frontend dynamically intercepts the AI output payload and deeply parses Markdown, rendering JSON syntax, XML exploits, and \`smali\` evidence blocks in a beautiful GitHub Dark Theme utilizing \`marked.js\` and \`highlight.js\`.

## 🚀 Local Development
1. Clone the repository and setup dependencies.
\`\`\`bash
npm install
cd analyzer && npm install
\`\`\`
2. Set up your local Google Generative AI environment variable:
Create an \`analyzer/.env\` file containing:
\`\`\`env
GEMINI_API_KEY=AIzaSy...
\`\`\`
3. Spin up the local local servers:
\`\`\`bash
# Terminal 1: Frontend Express Interface
npm run dev

# Terminal 2: DFIR Analysis Backend
cd analyzer && node index.js
\`\`\`
Navigate to [http://localhost:3000/analyzer](http://localhost:3000/analyzer) to begin scanning locally!

## ☁️ Cloud Run Production Deployment
This project is configured for fully automated Continuous Deployment (CI/CD) utilizing GitHub Actions (\`.github/workflows/deploy.yml\`). 
Simply pushing to the \`main\` branch automatically authenticates with your Google Cloud Service Account, securely injects the native GitHub Secret (\`GEMINI_API_KEY\`), scales the backend container to Node 20, and deploys both the analyzer and frontend clusters sequentially to production.
