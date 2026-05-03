# Contributing to FaceScore

First off, thank you for considering contributing to FaceScore! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## 🤝 How Can I Contribute?

### Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
- Open a new issue with a clear title and description of the suggested enhancement.
- Explain why this enhancement would be useful to most users.

### Pull Requests
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 22+
- npm 11+
- Rust + Cargo (for Tauri desktop app)
- An Anthropic API key

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/FaceScore.git
cd FaceScore

# Install NPM dependencies
npm install
```

### Running the App
- **Web Frontend Only:** `npm run dev`
- **Tauri Desktop App:** `npm run tauri dev`

### Quality Standards
Before submitting a PR, ensure your code passes all quality gates:
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 📝 License
By contributing, you agree that your contributions will be licensed under its Apache 2.0 License.