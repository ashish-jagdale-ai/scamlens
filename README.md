ScamLens 🛡️
Look closer. Stay safer.
ScamLens is a web-based scam-awareness tool that analyzes suspicious messages and highlights potential warning signs. It helps users understand concerning patterns and consider safer next steps before responding.
Important: ScamLens does not prove whether a message is fraudulent. Its findings are indicators, not a guarantee. Always verify important requests through official channels.
✨ Features
Suspicious message analysis — analyze text for potentially concerning patterns.
Warning signals — identify signals such as urgency, threats, suspicious links, payment requests, and requests for sensitive information.
Risk assessment — review the application's assessment alongside the signals detected.
Plain-language explanation — understand why a message may deserve closer inspection.
Safety guidance — receive practical next steps for safer decision-making.
Privacy-conscious design — analyze only the message you choose to submit; avoid entering passwords, OTPs, card details, or other sensitive information.
Optional AI explanation — the backend can use a locally available Ollama model; rule-based analysis and safety guidance can still work when Ollama is unavailable.
🌐 Live Demo
Try ScamLens: https://scamlens-dun.vercel.app/
🖥️ Technology Stack
Layer
Technology
Frontend
React, TypeScript, Vite
Backend
Node.js, Express
Analysis
Rule-based warning-signal detection
Optional AI
Ollama
Frontend hosting
Vercel
Source control
Git and GitHub
⚙️ Run Locally
Requirements
Node.js 20 or later
npm
1. Clone the repository
git clone https://github.com/ashish-jagdale-ai/scamlens.git
cd scamlens
2. Install dependencies
npm install
3. Configure environment variables
Copy .env.example to .env if you want a local environment file, then review the settings.
The project uses these configuration variables:
PORT — backend port; defaults to 3001.
HOST — backend listening address.
ALLOWED_ORIGINS — permitted frontend origins for CORS.
VITE_API_BASE_URL — frontend API base URL, configured at build time.
For local development, follow the example environment file and the instructions below.
4. Start the backend
Open a terminal and run:
npm run server
5. Start the frontend
Open a second terminal and run:
npm run dev
Open the local URL printed by Vite, normally:
http://localhost:5173
If you want optional AI explanations locally, install and run Ollama and ensure the configured model is available. The application should still provide rule-based analysis when Ollama is unavailable.
🧪 Checks
Run the production build:
npm run build
Run lint checks:
npm run lint
🔒 Privacy and Responsible Use
Do not submit passwords, OTPs, PINs, payment-card details, or other sensitive personal information.
Treat results as warning signals, not definitive judgments.
Do not rely on ScamLens as the sole basis for financial or security decisions.
Verify suspicious requests using a trusted official website, application, or phone number—not contact details supplied in the suspicious message.
🚧 Limitations
Rule-based detection can miss scams and can flag legitimate messages.
The presence or absence of a warning signal does not establish whether a message is fraudulent.
Optional AI explanations depend on the availability and configuration of the AI service.
🤝 Contributing
Contributions, suggestions, and bug reports are welcome. Please describe the issue or proposed change clearly and test changes before submitting a pull request.
📄 License
This project is distributed under the license included in the repository. See LICENSE for details.

ScamLens — Pause. Inspect. Verify.
