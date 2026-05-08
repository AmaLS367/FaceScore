<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,16,20&height=200&section=header&text=FaceScore&fontSize=60&animation=fadeIn&fontAlignY=35&desc=AI-Powered%20Face%20Feedback%20for%20Self-Improvement&descAlignY=55&descSize=20"/>

<div align="center">

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&center=true&vCenter=true&width=760&lines=Upload+a+photo;Get+a+structured+appearance+report;Improve+grooming%2C+presentation%2C+and+profile+photos;Export+everything+to+PDF" alt="Typing SVG" />
</p>

[![Tauri v2](https://img.shields.io/badge/Tauri-v2-FFC131.svg?style=for-the-badge&logo=tauri&logoColor=white)](https://v2.tauri.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Claude_Vision-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Vision" />
  <img src="https://img.shields.io/badge/Desktop-Windows_%7C_macOS_%7C_Linux-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Desktop OS" />
  <img src="https://img.shields.io/badge/Privacy-Local_First-111111?style=for-the-badge" alt="Privacy First" />
</p>

[Download Release](https://github.com/AmaLS367/FaceScore/releases) • [Report a Bug](https://github.com/AmaLS367/FaceScore/issues) • [Request a Feature](https://github.com/AmaLS367/FaceScore/issues)

</div>

---

> **Disclaimer:** FaceScore is an appearance and presentation helper. It does not provide medical, dermatology, psychological, identity, age, ethnicity, or professional attractiveness advice.

## FaceScore in one sentence

**FaceScore is a privacy-first desktop app that turns one photo into a structured AI appearance report with practical feedback for grooming, presentation, and profile optimization.**

Instead of vague compliments or chaotic opinions, you get a clean report with clear observations, strengths, weak points, and actionable suggestions you can actually use.

## Why people use FaceScore

People usually do not want "AI for the sake of AI".
They want answers like:

- How strong is my first visual impression?
- What are my strongest facial features?
- What should I improve in grooming or presentation?
- Is this photo helping or hurting how I look?
- Can I save the result as a clean report and review it later?

FaceScore is built exactly for that workflow.

## What you get

After uploading a photo, FaceScore generates a structured report that can include:

- overall impression and score
- facial feature analysis
- symmetry and proportion observations
- strengths and weaker areas
- grooming and presentation suggestions
- profile photo improvement ideas
- exportable PDF report

## Who this is for

FaceScore works especially well for people who want a more structured look at appearance and presentation:

- self-improvement users
- people optimizing dating or social profile photos
- creators building a stronger personal image
- anyone who prefers a private desktop workflow over uploading images to random web tools

## Why FaceScore is different

### Privacy-first by design
Your analysis happens from your desktop app directly to Anthropic's API through Tauri's native HTTP plugin. There is no intermediary backend operated by this project.

### Structured output instead of vague chatter
FaceScore asks the model for strict JSON and validates the response before rendering. The goal is a report you can read, compare, and use, not a messy wall of text.

### Built for repeatable review
The result is designed to be saved as a clean PDF so you can track feedback, compare photos, or keep a record of changes over time.

### Desktop instead of disposable web toy
FaceScore is packaged as a desktop app, which makes it feel more like a real tool and less like a throwaway demo.

## Download

You can download the latest desktop builds from the official releases page:

**[Download FaceScore from Releases](https://github.com/AmaLS367/FaceScore/releases)**

If you prefer running from source, setup instructions are below.

## Core features

| Feature | What it does | Status |
|---------|--------------|--------|
| AI Face Analysis | Generates a structured appearance report from a photo | Ready |
| Privacy-First Desktop Flow | No intermediary project backend between app and Anthropic | Ready |
| PDF Export | Saves your report as a clean printable PDF | Ready |
| Input Validation | Strict schema validation using Zod | Ready |
| Multi-format Upload | Supports JPG, PNG, and WebP up to 5 MB | Ready |

## How it works

```mermaid
graph LR
    A[Upload Photo] --> B[Claude Vision Analysis]
    B --> C[Strict JSON Response]
    C --> D[Validation with Zod]
    D --> E[Structured Report]
    E --> F[Export to PDF]
```

## Quick start for users

1. Download the latest release from the [Releases page](https://github.com/AmaLS367/FaceScore/releases).
2. Launch the app.
3. Paste your Anthropic API key into the settings field.
4. Upload a JPG, PNG, or WebP image.
5. Click **Analyze face**.
6. Review the report.
7. Export it to PDF if you want an offline copy.

## Requirements for local development

To build and run FaceScore locally, you need:

- **Node.js 22+**
- **npm 11+**
- **Rust + Cargo**
- **Anthropic API key**

## Installation from source

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

## Quality checks

Run these before opening a pull request:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Example use cases

### Improve your profile photo
Run a photo through FaceScore, review the suggestions, update lighting, angle, grooming, or expression, and test again.

### Build a self-improvement baseline
Save your first report as PDF, then compare future reports after improving haircut, skin care, beard styling, or photo quality.

### Get structured feedback without posting publicly
Use FaceScore privately on your own desktop instead of uploading photos to public communities and waiting for random opinions.

## Project structure

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

## Technical notes

- Requests are sent to `https://api.anthropic.com/v1/messages` through Tauri's native HTTP plugin.
- API keys are kept in memory only and cleared when the application closes.
- A strict Content Security Policy is enforced in `tauri.conf.json`.
- The default model is `claude-sonnet-4-20250514`.
- Claude is prompted to return valid JSON only.
- All responses are validated with Zod before rendering.
- PDF export uses print-optimized CSS and the native OS print dialog.

## Roadmap ideas

- before and after comparison mode
- multiple report templates
- stronger photo-specific recommendations
- better report customization
- richer export options

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## Security

Please read [SECURITY.md](SECURITY.md) if you want to report a vulnerability.

## License

Copyright 2026 FaceScore Contributors

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

### References
[Tauri v2 Documentation](https://v2.tauri.app/start/)
[Anthropic Vision Docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)
[Anthropic Messages API](https://docs.anthropic.com/en/api/messages)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>

</div>