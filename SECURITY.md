# Security Policy

## Supported Versions

Currently, only the latest version of FaceScore is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

We take the security of FaceScore seriously. If you discover a security vulnerability within this project, please send an email to the project maintainers or open a private vulnerability report via GitHub if enabled. 

**Do not publicly disclose the vulnerability until it has been addressed.**

We will review the report and attempt to provide a timeline for a fix. Please provide as much detail as possible, including:
- Steps to reproduce the issue.
- The potential impact of the vulnerability.
- Any suggestions for remediation.

### Note on API Keys
FaceScore stores your Anthropic API key locally in your browser/app storage. It is never transmitted to any servers other than Anthropic's official API endpoints. We consider the security of your API key to be of paramount importance.