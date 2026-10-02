# 🌟 NOVA CSS

**Modern, lightweight, utility-first CSS framework with design tokens, accessible components, and dark mode.**

[![npm version](https://img.shields.io/npm/v/nova-css.svg)](https://www.npmjs.com/package/nova-css)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## ✨ Features

- 🎨 **Design Tokens** - Complete token system with colors, spacing, typography
- 🧩 **Components** - Accessible, composable UI components
- 📱 **Responsive** - Mobile-first with breakpoint utilities
- 🌙 **Dark Mode** - Built-in light/dark/system theme support
- ♿ **Accessible** - WCAG 2.2 AA compliant
- ⚡ **Lightweight** - Minimal CSS output with CSS Layers
- 🎯 **Utility-First** - Rapid UI development
- 🔧 **Customizable** - Override any token with CSS custom properties
- 🌳 **Tree-Shakeable** - Import only what you need
- 📦 **Framework Agnostic** - Works with React, Vue, Svelte, or vanilla HTML

## 📦 Installation

```bash
# npm
npm install nova-css

# pnpm
pnpm add nova-css

# yarn
yarn add nova-css
```

## 🚀 Quick Start

### CSS Import

```css
/* Import everything */
@import "nova-css";

/* Or import individual layers */
@import "nova-css/reset";
@import "nova-css/tokens";
@import "nova-css/utilities";
@import "nova-css/components";
@import "nova-css/border-beam";
```

### HTML Usage

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <link rel="stylesheet" href="node_modules/nova-css/dist/index.css">
</head>
<body>
  <div class="nova-container nova-py-8">
    <h1 class="nova-text-3xl nova-font-bold nova-mb-4">Hello NOVA!</h1>
    <button class="nova-btn nova-btn-primary nova-btn-md">
      Get Started
    </button>
  </div>
</body>
</html>
```

### React Components

```tsx
import { BorderBeam } from 'nova-css/react';

function App() {
  return (
    <BorderBeam color="primary" size="md">
      <div className="nova-p-8">
        <h3>Animated Border Beam</h3>
      </div>
    </BorderBeam>
  );
}
```

## 🎨 Design Tokens

### Colors

```css
/* Semantic colors */
--nova-color-primary
--nova-color-secondary
--nova-color-success
--nova-color-warning
--nova-color-danger
--nova-color-info
--nova-color-background
--nova-color-surface
--nova-color-text
--nova-color-muted
--nova-color-border

/* Color scale (50-950) */
--nova-primary-50 through --nova-primary-950
--nova-secondary-50 through --nova-secondary-950
/* etc. */
```

### Typography

```css
--nova-font-sans
--nova-font-mono
--nova-font-serif
--nova-font-xs through --nova-font-6xl
--nova-weight-normal | medium | semibold | bold
```

### Spacing

```css
--nova-space-0 through --nova-space-64
```

## 🛠️ Utility Classes

### Layout

```html
<div class="nova-flex nova-items-center nova-justify-between nova-gap-4">
<div class="nova-grid nova-grid-cols-3 nova-gap-6">
<div class="nova-container nova-mx-auto">
```

### Responsive

```html
<div class="nova-flex nova-flex-col md:nova-flex-row nova-gap-4">
<div class="nova-hidden md:nova-block">
<div class="nova-text-lg md:nova-text-xl lg:nova-text-2xl">
```

### Spacing

```html
<div class="nova-p-4 nova-m-2">
<div class="nova-px-6 nova-py-4">
<div class="nova-mt-8 nova-mb-4">
```

## 🧩 Components

### Button

```html
<button class="nova-btn nova-btn-primary nova-btn-md">Primary</button>
<button class="nova-btn nova-btn-outline nova-btn-lg">Outline</button>
<button class="nova-btn nova-btn-ghost nova-btn-sm">Ghost</button>
```

### Card

```html
<div class="nova-card">
  <div class="nova-card-header">Header</div>
  <div class="nova-card-body">Body</div>
  <div class="nova-card-footer">Footer</div>
</div>
```

### Alert

```html
<div class="nova-alert nova-alert-success">
  <span>✓</span>
  <div>Success message</div>
</div>
```

### Badge

```html
<span class="nova-badge nova-badge-primary">New</span>
<span class="nova-badge nova-badge-success">Active</span>
```

## ✨ Border Beam Effects

Animated gradient border beams inspired by Magic UI:

```html
<div class="nova-border-beam nova-border-beam--primary">
  <div class="nova-border-beam__content nova-p-8">
    Animated gradient border
  </div>
</div>

<!-- Rainbow multi-color -->
<div class="nova-border-beam nova-border-beam--rainbow nova-border-beam--lg">
  <div class="nova-border-beam__content nova-p-8">
    Rainbow beam
  </div>
</div>
```

**Modifiers:**
- Colors: `--primary`, `--secondary`, `--success`, `--warning`, `--danger`, `--info`, `--rainbow`
- Sizes: `--sm`, `--md`, `--lg`
- Speed: `--slow`, `--fast`

## 🌙 Dark Mode

```html
<!-- Light mode -->
<html data-theme="light">

<!-- Dark mode -->
<html data-theme="dark">

<!-- System preference -->
<html data-theme="system">
```

## 🔧 Customization

Override design tokens in your CSS:

```css
:root {
  --nova-color-primary: #6366f1;
  --nova-font-sans: 'Inter', sans-serif;
  --nova-radius-lg: 0.75rem;
}
```

## 🏗️ Architecture

```
@layer nova-reset      → CSS Reset (box-sizing, margins, etc.)
@layer nova-tokens     → Design Tokens (CSS Custom Properties)
@layer nova-utilities  → Utility Classes (flex, grid, spacing, etc.)
@layer nova-components → UI Components (button, card, modal, etc.)
```

CSS Layers ensure proper cascade control. Your custom CSS always wins.

## 📦 Package Exports

```javascript
// Main CSS
import 'nova-css';

// Individual layers
import 'nova-css/reset';
import 'nova-css/tokens';
import 'nova-css/utilities';
import 'nova-css/components';
import 'nova-css/border-beam';

// React components
import { BorderBeam } from 'nova-css/react';
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- iOS Safari 15+

## 📚 Documentation

Full documentation available at [nova-css.dev](https://nova-css.dev)

- [Getting Started](https://nova-css.dev/installation)
- [Design Tokens](https://nova-css.dev/colors)
- [Utilities](https://nova-css.dev/utilities/layout)
- [Components](https://nova-css.dev/components/button)
- [Border Beam](https://nova-css.dev/border-beam)
- [Dark Mode](https://nova-css.dev/dark-mode)
- [Theming](https://nova-css.dev/theming)
- [Playground](https://nova-css.dev/playground)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

```bash
# Clone the repository
git clone https://github.com/yourusername/nova-css.git
cd nova-css

# Install dependencies
npm install

# Start development server
npm run dev

# Build framework
npm run build:framework
```

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by [Tailwind CSS](https://tailwindcss.com)
- Border Beam effects inspired by [Magic UI](https://magicui.design)
- Icons by [Lucide](https://lucide.dev)

## 📞 Contact

- Twitter: [@yourusername](https://twitter.com/yourusername)
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [nova-css.dev](https://nova-css.dev)

---

**Made with ❤️ by [Your Name]**
