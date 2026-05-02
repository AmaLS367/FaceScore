# FaceScore

FaceScore is a Tauri v2 desktop MVP for uploading a face photo, sending it to Claude Vision with a user-provided API key, rendering a structured appearance report, and exporting the report to PDF.

This app is an appearance and presentation helper. It is not medical, dermatology, psychological, identity, age, ethnicity, or professional attractiveness advice.

## Stack

- Tauri v2
- React
- TypeScript
- Vite
- Claude Messages API with image input

## Prerequisites

- Node.js 22+
- npm 11+
- Rust + Cargo for Tauri desktop development and builds
- An Anthropic API key supplied by the user at runtime

```powershell
npm install
```

## Development

Run the browser frontend:

```powershell
npm run dev
```

Run the Tauri desktop shell:

```powershell
npm run tauri dev
```

Build the frontend:

```powershell
npm run build
```

Build the desktop app after Rust is installed:

```powershell
npm run tauri build
```

## Quality Gates

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Usage

1. Paste an Anthropic API key into the Claude API field and save it.
2. Upload a JPG, PNG, or WebP image up to 5 MB.
3. Click `Analyze face`.
4. Review the structured report.
5. Click `Export PDF` and use the system print dialog to save as PDF.

The API key is stored locally in this app's browser storage. No API key is committed or bundled.

## Implementation Notes

- The app calls `https://api.anthropic.com/v1/messages` directly from the Tauri webview with `anthropic-dangerous-direct-browser-access: true`.
- The default model is `claude-sonnet-4-20250514`.
- Claude is prompted to return only JSON, and the app validates that JSON with Zod before rendering.
- PDF export uses print-friendly HTML/CSS instead of a native PDF engine in the MVP.

## References


- Tauri v2: https://v2.tauri.app/start/
- Anthropic Vision: https://docs.anthropic.com/en/docs/build-with-claude/vision
- Anthropic Messages API: https://docs.anthropic.com/en/api/messages
