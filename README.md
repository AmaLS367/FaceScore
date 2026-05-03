<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,16,20&height=200&section=header&text=FaceScore&fontSize=60&animation=fadeIn&fontAlignY=35&desc=AI-Powered%20Appearance%20Analysis&descAlignY=55&descSize=20"/>

<div align="center">

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&center=true&vCenter=true&width=600&lines=Analyze+Facial+Features;Claude+Vision+Integration;Structured+Reports+%7C+PDF+Export;Tauri+v2+%7C+React+%7C+TypeScript" alt="Typing SVG" />
</p>

[![Tauri v2](https://img.shields.io/badge/Tauri-v2-FFC131.svg?style=for-the-badge&logo=tauri&logoColor=white)](https://v2.tauri.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Claude_Vision-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Vision" />
  <img src="https://img.shields.io/badge/Desktop-Windows_%7C_macOS_%7C_Linux-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Desktop OS" />
  <img src="https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

> **Disclaimer:** This app is an appearance and presentation helper. It is not medical, dermatology, psychological, identity, age, ethnicity, or professional attractiveness advice.

</div>

<br/>

FaceScore is a desktop application that allows you to upload a photo, analyze facial features using Claude Vision AI, and generate a beautifully structured report that can be exported to PDF. Built with modern web technologies and wrapped in a lightweight Rust-based Tauri shell.

## ✨ Features

<div align="center">

```mermaid
graph LR
    A[📸 Upload Photo] -->|Local Path| B[🤖 Claude API]
    B -->|Vision Analysis| C[📝 Parse JSON]
    C -->|Zod Validation| D[✨ Render Report]
    D -->|Print Dialog| E[📄 Export PDF]

    style A fill:#4A90E2,stroke:#2c3e50,stroke-width:2px,color:#fff
    style B fill:#D97757,stroke:#2c3e50,stroke-width:2px,color:#fff
    style C fill:#FFD93D,stroke:#2c3e50,stroke-width:2px,color:#333
    style D fill:#50C878,stroke:#2c3e50,stroke-width:2px,color:#fff
    style E fill:#B19CD9,stroke:#2c3e50,stroke-width:2px,color:#fff
```

</div>

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI Vision** | Deep analysis using Claude 3.5 Sonnet Vision | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 🛡️ **Privacy First** | API keys stored locally, no intermediary servers | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 📄 **PDF Export** | Print-friendly CSS for elegant offline reports | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 🖼️ **Format Support** | JPG, PNG, and WebP up to 5 MB | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| ✅ **Type Safety** | Strict JSON schema validation using Zod | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |

## 📋 Requirements

To build and run FaceScore locally, you need the following:

- 🟢 **Node.js 22+** and **npm 11+**
- 🦀 **Rust + Cargo** (required for Tauri desktop build)
- 🔑 **Anthropic API Key** (supplied at runtime in the app)

## 💻 Installation & Development

> [!NOTE]
> The application runs directly on your machine. You communicate securely from the client straight to Anthropic's API.

<details>
<summary><b>📦 Step-by-step setup guide</b></summary>

### 1. Clone the repository
```powershell
git clone https://github.com/yourusername/FaceScore.git
cd FaceScore
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Run the development environment
To run the browser frontend only (useful for UI tweaks):
```powershell
npm run dev
```

To run the full Tauri desktop shell:
```powershell
npm run tauri dev
```

### 4. Build for production
Build the frontend assets:
```powershell
npm run build
```

Build the native desktop application installer/executable:
```powershell
npm run tauri build
```

</details>

## 🧪 Quality Gates

We maintain high code quality with a strict suite of checks. Run these before submitting any pull requests:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 📖 Usage

1. **Configure API:** Open the app, paste your Anthropic API key into the settings field, and save it. *(For maximum security, the key is kept in memory only and will be cleared when you close the app).*
2. **Upload:** Select a JPG, PNG, or WebP image (max 5 MB).
3. **Analyze:** Click `Analyze face` and wait for Claude Vision to process the image.
4. **Review:** Read through your structured appearance report.
5. **Export:** Click `Export PDF` to open the system print dialog and save the result as a styled PDF.

<div align="center">

## 📁 Project Structure

```
FaceScore/
├── src-tauri/             # Rust-based desktop shell
│   ├── src/               # Tauri entry points
│   └── tauri.conf.json    # Tauri configuration
├── src/                   # React Frontend
│   ├── components/        # UI components (PhotoUploader, ReportView)
│   ├── domain/            # Business logic, prompts, Zod schemas
│   ├── lib/               # Utilities and stores
│   └── services/          # API clients (Anthropic)
├── public/                # Static assets
└── package.json           # Node dependencies and scripts
```

</div>

## ⚙️ Implementation Notes

- **Secure API Routing:** The app calls `https://api.anthropic.com/v1/messages` via Tauri's native HTTP plugin (`@tauri-apps/plugin-http`). This routes the request securely through the Rust backend, completely bypassing the browser context. The `anthropic-dangerous-direct-browser-access` header has been removed.
- **Strict Security:** A strict Content Security Policy (CSP) is enforced via `tauri.conf.json` with no `unsafe-inline` scripts allowed, and JavaScript prototypes are frozen. LocalStorage has been explicitly removed in favor of ephemeral session memory for API keys.
- **Model Choice:** The default model is `claude-sonnet-4-20250514`.
- **Validation:** Claude is explicitly prompted to return *only* valid JSON. The app then strictly validates this payload using Zod before any rendering occurs.
- **PDF Generation:** We use customized print-media CSS queries linked to the native OS print dialog to generate PDFs, keeping the bundle size small without needing a heavy PDF rendering engine.

## 🤝 Contributing

Contributions are highly appreciated! Check out our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## 🔒 Security

Please refer to our [Security Policy](SECURITY.md) for reporting vulnerabilities.

## 📄 License

Copyright 2026 FaceScore Contributors

Licensed under the Apache License, Version 2.0 (the "License"). See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

### 📚 References
[Tauri v2 Documentation](https://v2.tauri.app/start/)
[Anthropic Vision Docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)
[Anthropic Messages API](https://docs.anthropic.com/en/api/messages)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>

</div>
