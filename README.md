# 🛡️ Sovereign Cyber AI Initiative

Welcome to the **Sovereign Cyber AI** repository! This project is a dual-purpose computational platform integrating a comprehensive 5-module educational course on AI-driven cybersecurity alongside a proprietary, production-ready **Digital Forensics and Incident Response (DFIR) Malware Analyzer**.

---

## 📚 Part 1: The Cyber AI Course
Interactive, localized, and dynamic educational modules built to train the next generation of cybersecurity analysts.
The course engine runs natively on an Express.js server and dynamically parses Markdown content into a beautiful reading experience using `marked`.

**Core Modules:**
1. Introduction to AI in Cybersecurity
2. The Evolving Threat Landscape
3. Specialized AI Tools (SIEM, SOAR, EDR)
4. Mobile APK Analysis & Reverse Engineering
5. Sovereign Custom Deployed Solutions (IndiaAI Mission & Sarvam AI)

*Features deep multi-lingual layout switching (English, Hindi, Kannada) for expanded technical outreach.*

---

## 🕵️ Part 2: Sovereign DFIR Engine (Mobile Malware Analyzer)
The crown jewel of the repository. A hyper-advanced, automated static malware analysis engine heavily powered by **Gemini 3.1 Flash Preview**.

Built with a dedicated Node.js Cloud Run backend and a Premium Glassmorphism UI frontend, the architecture seamlessly decompiles Android applications, maps and extracts their internal Java/Dalvik Smali codebase, and streams it to Google AI Studio for elite Threat Intelligence extraction.

### ✨ DFIR Enterprise Features
* **Full-Codebase Extraction:** Dynamically utilizes `apktool` to structurally rip and unpack the core Android manifest and underlying Java/Dalvik classes.
* **Smart Boilerplate Evasion Filter:** Automatically identifies and strips massive 3rd-party generic frameworks (`androidx`, `com/google`, `kotlin/`) to preserve the 1M token AI context boundary strictly for the developer's core operational logic!
* **Native Anti-Analysis Sandbox Detector:** Hardened backend structures natively intercept malformed ZIP Central Directory (CEN) headers (e.g. invalid `8314` compression methods) deployed by highly-sophisticated malware to freeze decompilers. By anticipating this exact attack vector, it automatically shunts past the AI to deliver an instant **100% Confidence Forensic Alert**.
* **Glassmorphism Markdown Engine:** Parses raw dynamic intelligence into beautiful GitHub Dark-Theme VSCode style outputs featuring fully syntax-highlighted `smali` evidence blocks in real-time.

---

## 🚀 Local Development Setup

### 1. Requirements
* Node.js (v18+)
* Java Runtime Environment (JRE)

### 2. Installation
Clone the repository and install both frontend and backend dependencies:
```bash
git clone https://github.com/harshdattani23/Sovereign-DFIR.git
cd Sovereign-DFIR

# Install Course Frontend dependencies
npm install

# Install DFIR Backend dependencies
cd analyzer && npm install
```

### 3. API Key Configuration
Create a `.env` file strictly inside the `analyzer/` directory to authenticate the Gemini AI model constraint engine:
```env
# analyzer/.env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

### 4. Running the Project Locally
You will need two separate terminal windows to run both microservices concurrently:
```bash
# Terminal 1: Spin up the Course UI and DFIR Upload Portal
npm run dev

# Terminal 2: Spin up the Local DFIR Extraction Service
cd analyzer
node index.js
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the course, or hit up [http://localhost:3000/analyzer](http://localhost:3000/analyzer) to test the live Malware Scanner!

---

## ☁️ Cloud Run Production Deployment (CI/CD)
This project is configured for fully automated Continuous Deployment utilizing GitHub Actions (`.github/workflows/deploy.yml`). 

Pushing to the `main` branch authenticates with your Google Cloud IAM service account tokens natively via GitHub secrets, injects your remote API keys into the master backend image, and seamlessly clusters both instances across Google Cloud Run environments.
