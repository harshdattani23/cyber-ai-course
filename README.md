# 🛡️ Sovereign Cyber AI Initiative

Welcome to the **Sovereign Cyber AI** repository! This project has two main parts: an **Android Malware Analyzer** powered by Artificial Intelligence, and a **5-Module Cybersecurity Course** designed to teach students about AI security.

---

## 🕵️ Part 1: Android Malware Analyzer
This is an automated tool that scans Android apps (APKs) to see if they are malicious or infected. It uses the **Gemini 3.1 AI** to read the app's internal code and explain any security threats.

### ⚙️ How the Analyzer Works
Here is the step-by-step process of what happens when you upload an Android app:

1. **File Upload:** You upload an Android `.apk` file through the website.
2. **Extracting the App:** The server uses a tool called `apktool` to unpack the app. This converts the compiled Android code into a readable text format.
3. **Filtering out Clutter:** Most apps contain thousands of files from generic, common libraries (like Google or Android tools). To save time and AI limits, the server automatically ignores these common files and only looks at the app's unique, custom code.
4. **Stopping Anti-Analysis Tricks:** Some malware is built to crash analysis tools on purpose using bad ZIP files. The server is smart enough to detect these tricks natively. If it catches one, it completely skips the AI and immediately flags the app as 100% malicious.
5. **AI Analysis:** The cleaned-up code is sent securely to the **Gemini 3.1** AI. The AI acts as a cybersecurity expert and checks the code for:
   - Suspicious permissions or hidden behaviors.
   - Leaked passwords, hidden web links, and API Keys.
   - Weak or broken security settings.
6. **Viewing the Results:** Finally, the website takes the AI's final report and displays it clearly on the screen, highlighting the exact lines of code where the threats were found.

---

## 📚 Part 2: The Cyber AI Course
This is an interactive course built to teach students about AI in cybersecurity. The website is built with Node.js and turns Markdown files into easy-to-read lessons with a modern design.

**Course Modules:**
1. Introduction to AI in Cybersecurity
2. The Evolving Threat Landscape
3. Specialized AI Tools (SIEM, SOAR, EDR)
4. Mobile APK Analysis & Reverse Engineering
5. Custom AI Solutions (IndiaAI Mission & Sarvam AI)

*The course is fully bilingual and available in multiple languages including English, Hindi, and Kannada.*

---

## 🚀 Local Development Setup

### 1. Requirements
* Node.js (v18+)
* Java (needed to unpack the APKs)

### 2. Installation
Clone the repository to your computer and install the required packages:
```bash
git clone https://github.com/harshdattani23/Sovereign-DFIR.git
cd Sovereign-DFIR

# Install the Course frontend
npm install

# Install the Analyzer backend
cd analyzer && npm install
```

### 3. API Key Setup
You need a Google Gemini API key for the AI to work. Create a `.env` file inside the `analyzer/` folder:
```env
# analyzer/.env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

### 4. Running the Project Locally
You will need to open two separate terminal windows:
```bash
# Terminal 1: Start the main website
npm run dev

# Terminal 2: Start the backend analyzer
cd analyzer
node index.js
```
Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the course, or [http://localhost:3000/analyzer](http://localhost:3000/analyzer) to test the Malware Scanner!

---

## ☁️ Cloud Deployment
This project is entirely set up to automatically deploy to Google Cloud Run using GitHub Actions (`.github/workflows/deploy.yml`). 

Whenever you push your code to the `main` branch, GitHub will automatically securely build the project, inject your API keys, and update your live, public website.
