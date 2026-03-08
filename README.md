# CredX: Decentralized AI-Powered Credential Verification

**CredX** is a cutting-edge platform designed to revolutionize academic and professional credentialing using the power of the **Algorand Blockchain**, **Generative AI**, and **Decentralized Identity**. 

By transforming traditional certificate issuance into verifiable, tamper-proof Digital Assets (ASAs), CredX ensures that every achievement is universally discoverable, instantly verifiable, and narratively enriched.

---

## 🚀 Key Features

### 🔐 Blockchain-Verified Credentials
- **Asset-Based Accreditation**: Credentials are minted as NFTs (Algorand Standard Assets) following the ARC-3 standard.
- **Tamper-Proof Integrity**: Metadata is stored securely on **IPFS**, with hashes anchored on-chain to prevent manipulation.
- **Instant Verification**: A public verification engine allows anyone to validate the authenticity of a credential in seconds.

### 🤖 AI-Driven Insights & Narration
- **Smart Analysis**: Integrated with **Google Gemini (3.1 Flash Lite)** to generate intelligent summaries and professional insights for every credential.
- **AI Voice Narration**: Each credential features professional audio narration powered by **ElevenLabs**, providing an accessible and engaging overview of achievements.
- **Fraud Detection**: AI-powered heuristics to detect and flag potentially fraudulent or inconsistent credential metadata.

### 👥 Multi-User Dashboards
- **Institution Portal**: A robust workspace for schools and companies to manage their issuer identity, mint new credentials, and track issuance history.
- **Student Dashboard**: A personalized hub for recipients to manage their digital wallet, view credentials, and share professional profiles.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React 19, Turbopack)
- **Backend**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Blockchain**: [Algorand](https://algorand.co/) (Smart Contracts & ASAs)
- **AI Models**: Google [Gemini](https://deepmind.google/technologies/gemini/) & [ElevenLabs](https://elevenlabs.io/)
- **Authentication**: [Auth0](https://auth0.com/)
- **Storage**: [IPFS](https://ipfs.tech/) via Pinata
- **Styling**: Vanilla CSS with Tailwind CSS for high-performance UI.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Algorand Testnet Account (with Algos)
- Auth0 Account & Application
- Google AI (Gemini) API Key
- ElevenLabs API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IsVohi/CredX.git
   cd CredX
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root based on the provided `env.txt`. Ensure all API keys and Algorand credentials are correctly set.

3. **Install Dependencies**:
   ```bash
   ./start.sh
   ```
   *Note: This script will install dependencies for both frontend and backend and start the development servers.*

---

## 🌍 Deployment

CredX is optimized for deployment on **Vercel**. 

- **Frontend**: Deploy the `/frontend` directory as a Next.js project.
- **Backend**: Deploy the `/backend` directory as a standalone Node.js project or use the provided unified `vercel.json` routing.

For detailed instructions, refer to the [Deployment Guide](deployment_guide.md).

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
