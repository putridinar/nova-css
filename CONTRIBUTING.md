# Contributing to NOVA CSS

Thank you for your interest in contributing to NOVA CSS! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and inclusive in all interactions. We welcome contributors of all experience levels.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/putridinar/nova-css.git
cd nova-css

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Project Structure

```
nova-css/
├── src/
│   ├── nova/           # Core CSS framework
│   │   ├── reset.css   # CSS Reset
│   │   ├── tokens.css  # Design Tokens
│   │   ├── utilities.css # Utility Classes
│   │   ├── components.css # UI Components
│   │   ├── index.css   # Main Entry
│   │   └── types.ts    # TypeScript Types
│   ├── App.tsx         # Documentation App
│   └── index.css       # Site Styles
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Code example if possible

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the use case
3. Provide examples of the proposed API
4. Explain how it fits the framework philosophy

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add/update tests if applicable
5. Update documentation
6. Submit a pull request

## CSS Guidelines

### Architecture

- Use CSS Layers for proper cascade control
- All tokens must be CSS Custom Properties
- Follow the naming convention: `nova-{category}-{value}`
- Keep specificity low and predictable
- Use logical properties where possible (inline/block instead of left/right)

### Naming Convention

```
nova-{type}-{variant}-{size}

Examples:
nova-btn-primary-md
nova-text-sm
nova-p-4
nova-bg-surface
```

### Responsive Utilities

```
{breakpoint}\:nova-{utility}

Examples:
md:nova-flex
lg:nova-text-xl
```

## Component Guidelines

- Must be accessible (keyboard navigation, ARIA where needed)
- Must support dark mode via CSS variables
- Must be responsive
- Must use semantic HTML
- Must not require JavaScript for basic functionality
- TypeScript types required for React components

## Testing

- Test utility class generation
- Test component rendering
- Test accessibility (keyboard nav, screen reader)
- Test responsive behavior
- Test dark mode
- Test cross-browser compatibility

## Documentation

- Every component needs documentation
- Include live examples
- Include code snippets
- Document all props/variants
- Keep examples minimal and clear

## Commit Messages

Follow conventional commits:

```
feat: add new button variant
fix: correct spacing token value
docs: update installation guide
style: format CSS files
refactor: simplify color token structure
test: add component tests
chore: update dependencies
```

## Questions?

Open a discussion or reach out via GitHub Issues.

Thank you for contributing! 🚀
