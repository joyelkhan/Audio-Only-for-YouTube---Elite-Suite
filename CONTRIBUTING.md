# Contributing to YouTube Audio Player - Background Play & Data Saver

First off, thank you for considering contributing to this project! 🎉

This document provides guidelines for contributing to the YouTube Audio Player - Background Play & Data Saver extension.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🛠️ How Can I Contribute?

### 1. Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting bugs, include:**
- Clear, descriptive title
- Exact steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Chrome version and OS
- Extension version

**Use this template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Chrome Version: [e.g., 120.0.6099.109]
- Extension Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

### 2. Suggesting Features

Feature suggestions are welcome! Please provide:
- Clear use case
- Expected behavior
- Why this would be useful
- Possible implementation approach (optional)

### 3. Code Contributions

We love pull requests! Here's how to contribute code:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

---

## 💻 Development Setup

### Prerequisites

- Chrome browser (version 88+)
- Git
- Text editor or IDE (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/audio-only-youtube-elite.git
cd "AUDIO ONLY FOR YOUTUBE™ - ELITE EDITION"

# 2. Load extension in Chrome
# - Open chrome://extensions/
# - Enable Developer mode
# - Click "Load unpacked"
# - Select the extension directory

# 3. Make changes and test
# - Edit files
# - Click refresh icon on chrome://extensions/
# - Test on YouTube
```

### Project Structure

```
├── manifest.json           # Extension configuration
├── content-scripts/        # Scripts injected into YouTube
├── background/            # Service worker
├── popup/                 # Extension popup UI
├── injected/              # Page-context scripts
├── icons/                 # Extension icons
└── _locales/             # Translations
```

---

## 📝 Coding Guidelines

### JavaScript Style

```javascript
// Use ES6+ features
const myFunction = async () => {
    // Arrow functions for callbacks
    const result = await someAsyncOperation();
    return result;
};

// Clear variable names
const isAudioModeActive = true;  // Good
const flag = true;                // Bad

// Comments for complex logic
// Calculate bandwidth savings based on video quality
const savings = calculateSavings(quality);
```

### Code Quality Rules

1. **Use meaningful names** for variables, functions, and classes
2. **Keep functions small** - one responsibility per function
3. **Add comments** for complex logic, not obvious code
4. **Handle errors** - always use try-catch for async operations
5. **Avoid global variables** - use modules and classes
6. **Use const/let** - never use var
7. **Consistent formatting** - 4 spaces for indentation

### CSS Style

```css
/* Use BEM-like naming */
.audio-player-container { }
.audio-player__controls { }
.audio-player__button--active { }

/* Group related properties */
.element {
    /* Positioning */
    position: relative;
    top: 0;
    
    /* Display & Box Model */
    display: flex;
    width: 100%;
    padding: 10px;
    
    /* Visual */
    background: #fff;
    border: 1px solid #ccc;
    
    /* Typography */
    font-size: 14px;
    color: #333;
    
    /* Misc */
    cursor: pointer;
}
```

### File Organization

- **One class per file** when possible
- **Group related functions** together
- **Export at the bottom** of the file
- **Imports at the top** of the file

---

## 📨 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(ui): add playback speed control

Added buttons to control playback speed from 0.5x to 2.0x.
Includes visual feedback and keyboard shortcuts.

Closes #42

---

fix(controller): prevent duplicate initialization

Fixed bug where controller was initialized multiple times
on single-page navigation, causing memory leaks.

Fixes #38

---

docs(readme): update installation instructions

Added troubleshooting section and improved clarity
of the installation steps.
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ **Test your changes** thoroughly
2. ✅ **Update documentation** if needed
3. ✅ **Follow coding guidelines**
4. ✅ **Write clear commit messages**
5. ✅ **Ensure no console errors**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on YouTube
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, it will be merged
4. Your contribution will be credited!

---

## 🐛 Reporting Bugs

### Security Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.
Email: security@audioonlyelite.com

### Regular Bugs

Use GitHub Issues with the bug report template.

**Good bug report:**
- Clear title: "Audio player controls not responding on Chrome 120"
- Detailed steps to reproduce
- Expected vs. actual behavior
- Environment details
- Screenshots or console logs

---

## 💡 Suggesting Features

### Before Suggesting

1. Check if it's already suggested
2. Consider if it fits the project scope
3. Think about implementation complexity

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How could this be implemented?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in the README (for significant contributions)

---

## 📞 Questions?

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For specific problems
- **Email**: feedback@audioonlyelite.com

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to YouTube Audio Player - Background Play & Data Saver!** 🎧

Your efforts help make YouTube a better experience for focused listening.
