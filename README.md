<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,16,20&height=200&section=header&text=FaceScore&fontSize=60&animation=fadeIn&fontAlignY=35&desc=AI-Powered%20Appearance%20Analysis&descAlignY=55&descSize=20"/>

<div align="center">

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&center=true&vCenter=true&width=760&lines=Upload+a+photo;Analyze+facial+features;Get+a+structured+report;Export+everything+to+PDF" alt="Typing SVG" />
</p>

[![Tauri v2](https://img.shields.io/badge/Tauri-v2-FFC131.svg?style=for-the-badge&logo=tauri&logoColor=white)](https://v2.tauri.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Claude_Vision-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Vision" />
  <img src="https://img.shields.io/badge/Desktop-Windows_%7CmacOS_%7CLinux-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Desktop OS" />
  <img src="https://img.shields.io/badge/Privacy-Local_First-111111?style=for-the-badge" alt="Privacy First" />
  <img src="https://img.shields.io/badge/Export-PDF-8A2BE2?style=for-the-badge" alt="PDF Export" />
</p>

### ✨ AI-powered appearance analysis with clean reports, practical feedback, and local-first privacy.

[⬇️ Download Release](https://github.com/AmaLS367/FaceScore/releases) • [🐞 Report a Bug](https://github.com/AmaLS367/FaceScore/issues) • [💡 Request a Feature](https://github.com/AmaLS367/FaceScore/issues)

</div>

---

> **Disclaimer:** FaceScore is an appearance and presentation helper. It is not medical, dermatology, psychological, identity, age, ethnicity, or professional attractiveness advice.

## 🚀 What is FaceScore?

**FaceScore** is a desktop app that helps you look at a photo more objectively.

Upload an image, run the analysis, and get a structured report with observations about facial features, overall presentation, strong points, weaker areas, and practical suggestions you can actually work with.

No random comments from strangers. No chaotic wall of text. Just a clean report you can read, save, and compare.

## 💎 Why FaceScore feels useful

Most people are not looking for buzzwords.
They are looking for clarity.

FaceScore helps answer questions like:

- 🤔 What stands out first in my appearance?
- 📐 Are my features balanced and well-presented in this photo?
- ✂️ What can I improve in grooming, styling, or presentation?
- 🖼️ Is this a strong photo or a weak one?
- 📄 Can I save the result as a clean report and revisit it later?

That is the whole point of the product.

## ✨ What you get in the report

After uploading a photo, FaceScore can generate a structured report with:

- 🧠 overall impression
- 🔢 score and breakdown
- 📐 symmetry and proportion observations
- 🌟 standout strengths
- ⚠️ weaker points or limiting factors
- ✂️ grooming and presentation suggestions
- 📸 photo improvement ideas
- 📄 exportable PDF version

## 🎯 Who it is for

FaceScore fits especially well for:

- self-improvement users
- people improving social or profile photos
- creators who care about presentation
- users who prefer a private desktop workflow over random browser tools

## 🔥 Why FaceScore stands out

### 🛡️ Privacy-first by design
The app talks directly to Anthropic's API through Tauri's native HTTP plugin. There is no intermediary backend run by this project.

### 🧱 Structured instead of messy
FaceScore pushes the model to return strict JSON and validates the result before rendering. The output is designed to feel like a real report, not AI rambling.

### 📄 Built for saving and comparing
You can export the result to PDF and keep it for later. This makes it easier to compare photos, track changes, or build a baseline.

### 🖥️ Desktop app, not throwaway demo
FaceScore is packaged as a real desktop application, which makes the whole experience cleaner, more stable, and more private.

## ⬇️ Download

Want to try it right away?

**[Download the latest release here](https://github.com/AmaLS367/FaceScore/releases)**

If you prefer building from source, the full setup steps are below.

## 🌟 Core features

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI Vision Analysis** | Structured appearance feedback from a single photo | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 🛡️ **Privacy First** | No intermediary project backend between app and Anthropic | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 📄 **PDF Export** | Save reports as clean printable PDFs | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| ✅ **Validation Layer** | Strict schema validation using Zod | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |
| 🖼️ **Image Support** | JPG, PNG, and WebP up to 5 MB | ![](https://img.shields.io/badge/-Ready-success?style=flat-square) |

## 🧩 How it works

<div align="center">

```mermaid
graph LR
    A[📸 Upload Photo] -->|Image Input| B[🤖 Claude Vision]
    B -->|Structured Output| C[🧾 Strict JSON]
    C -->|Validation| D[✅ Zod]
    D -->|Rendering| E[✨ Report View]
    E -->|Save| F[📄 PDF Export]

    style A fill:#4A90E2,stroke:#2c3e50,stroke-width:2px,color:#fff
    style B fill:#D97757,stroke:#2c3e50,stroke-width:2px,color:#fff
    style C fill:#FFD93D,stroke:#2c3e50,stroke-width:2px,color:#333
    style D fill:#50C878,stroke:#2c3e50,stroke-width:2px,color:#fff
    style E fill:#9B59B6,stroke:#2c3e50,stroke-width:2px,color:#fff
    style F fill:#B19CD9,stroke:#2c3e50,stroke-width:2px,color:#fff
```

</div>

## ⚡ Quick start

1. ⬇️ Download the latest version from the [Releases page](https://github.com/AmaLS367/FaceScore/releases)
2. 🔑 Open the app and paste your Anthropic API key
3. 🖼️ Upload a JPG, PNG, or WebP image
4. 🤖 Click **Analyze face**
5. 📖 Review your report
6. 📄 Export it to PDF if you want an offline copy

## 🧪 Real use cases

### 📸 Upgrade your profile photo
Run a photo through FaceScore, spot weak points, improve lighting, angle, grooming, or expression, then test again.

### ✂️ Build a grooming baseline
Save your first report as PDF and compare future results after changing haircut, beard styling, skin care, or photo quality.

### 🤫 Get feedback privately
Use FaceScore on your own desktop instead of posting photos publicly and waiting for random opinions.

## 📋 Requirements

To build and run FaceScore locally, you need:

- 🟢 **Node.js 22+**
- 📦 **npm 11+**
- 🦀 **Rust + Cargo**
- 🔑 **Anthropic API key**

## 💻 Installation from source

### 1. Clone the repository

```powershell
git clone https://github.com/AmaLS367/FaceScore.git
cd FaceScore
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Run the frontend only

```powershell
npm run dev
```

### 4. Run the full desktop app

```powershell
npm run tauri dev
```

### 5. Build for production

```powershell
npm run build
npm run tauri build
```

## 🧪 Quality checks

Run these before opening a pull request:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 📁 Project structure

```text
FaceScore/
├── src-tauri/             # Rust-based desktop shell
│   ├── src/               # Tauri entry points
│   └── tauri.conf.json    # Tauri configuration
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── domain/            # Prompts, schemas, business logic
│   ├── lib/               # Utilities and stores
│   └── services/          # API clients
├── public/                # Static assets
└── package.json           # Scripts and dependencies
```

## ⚙️ Technical notes

- Requests go to `https://api.anthropic.com/v1/messages` through Tauri's native HTTP plugin.
- API keys are stored in memory only and cleared when the app closes.
- A strict Content Security Policy is enforced in `tauri.conf.json`.
- The default model is `claude-sonnet-4-20250514`.
- Claude is prompted to return valid JSON only.
- Every response is validated with Zod before rendering.
- PDF export uses print-optimized CSS and the native OS print dialog.

## 🛣️ Roadmap ideas

- before and after comparison mode
- more report templates
- stronger photo-specific recommendations
- deeper customization
- richer export options

## 🤝 Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## 🔒 Security

Please read [SECURITY.md](SECURITY.md) if you want to report a vulnerability.

## 📄 License

Copyright 2026 FaceScore Contributors

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 📚 References
[Tauri v2 Documentation](https://v2.tauri.app/start/)
[Anthropic Vision Docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)
[Anthropic Messages API](https://docs.anthropic.com/en/api/messages)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>

</div>