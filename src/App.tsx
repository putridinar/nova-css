import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { 
  Menu, X, Sun, Moon, Copy, Check, ChevronRight, 
  Zap, Palette, Puzzle, Smartphone, Moon as MoonIcon, 
  Accessibility, Code, Play, ExternalLink, 
  Info, CheckCircle, AlertTriangle, AlertCircle,
  ArrowLeft, ArrowRight, Plus, Minus, Search,
  Github, Twitter, Mail, Heart, Star
} from 'lucide-react';
// @ts-expect-error CSS is handled by the bundler; TypeScript has no CSS module declaration.
import './nova/index.css';
import { BorderBeam } from './nova/BorderBeam';

// ---- Simple Hash Router ----
interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({ path: '/', navigate: () => {} });

function useRouter() {
  return useContext(RouterContext);
}

function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function Route({ path: routePath, element, currentPath }: { path: string; element: ReactNode; currentPath: string }) {
  if (routePath === currentPath) {
    return <>{element}</>;
  }
  return null;
}

function Routes({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  const routes = Array.isArray(children) ? children : [children];
  for (const route of routes) {
    if (route && typeof route === 'object' && 'props' in route) {
      const props = route.props as { path: string; element: ReactNode };
      if (props.path === currentPath) {
        return <>{props.element}</>;
      }
    }
  }
  // Fallback to index route
  for (const route of routes) {
    if (route && typeof route === 'object' && 'props' in route) {
      const props = route.props as { path?: string; element: ReactNode };
      if (props.path === '/') {
        return <>{props.element}</>;
      }
    }
  }
  return null;
}

function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { navigate } = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };
  return (
    <a href={`#${to}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

function useLocation() {
  return { pathname: useRouter().path };
}

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {} });

function useTheme() {
  return useContext(ThemeContext);
}

// Theme Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Navigation Data
const navSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/installation' },
      { label: 'Quick Start', path: '/quick-start' },
    ]
  },
  {
    title: 'Design System',
    items: [
      { label: 'Colors', path: '/colors' },
      { label: 'Typography', path: '/typography' },
      { label: 'Spacing', path: '/spacing' },
      { label: 'Shadows', path: '/shadows' },
    ]
  },
  {
    title: 'Utilities',
    items: [
      { label: 'Layout', path: '/utilities/layout' },
      { label: 'Flexbox & Grid', path: '/utilities/flexbox-grid' },
      { label: 'Spacing', path: '/utilities/spacing' },
      { label: 'Sizing', path: '/utilities/sizing' },
      { label: 'Responsive', path: '/utilities/responsive' },
    ]
  },
  {
    title: 'Components',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
      { label: 'Card', path: '/components/card' },
      { label: 'Badge', path: '/components/badge' },
      { label: 'Alert', path: '/components/alert' },
      { label: 'Table', path: '/components/table' },
      { label: 'Modal', path: '/components/modal' },
      { label: 'Tabs', path: '/components/tabs' },
      { label: 'Navigation', path: '/components/navigation' },
    ]
  },
  {
    title: 'Tools',
    items: [
      { label: 'Playground', path: '/playground' },
      { label: 'Dark Mode', path: '/dark-mode' },
      { label: 'Theming', path: '/theming' },
      { label: 'Border Beam', path: '/border-beam' },
    ]
  }
];

// Sidebar Content Component (reusable navigation)
function SidebarContent({ onClose, showCloseButton = false }: { onClose: () => void; showCloseButton?: boolean }) {
  const location = useLocation();
  
  return (
    <div className="nova-sidebar nova-h-full">
      <div className="nova-sidebar-header nova-flex nova-items-center nova-justify-between">
        <Link to="/" className="nova-flex nova-items-center nova-gap-2" onClick={onClose}>
          <div className="nova-flex nova-items-center nova-justify-center" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--nova-primary-500), var(--nova-secondary-500))', borderRadius: 'var(--nova-radius-lg)' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>N</span>
          </div>
          <span className="nova-font-bold nova-text-lg">NOVA CSS</span>
        </Link>
        {showCloseButton && (
          <button onClick={onClose} className="nova-btn nova-btn-ghost nova-btn-sm"><X size={18} /></button>
        )}
      </div>
      <nav className="nova-sidebar-nav nova-py-4">
        {navSections.map((section) => (
          <div key={section.title} className="nova-mb-4">
            <div className="nova-sidebar-section">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nova-sidebar-item ${location.pathname === item.path ? 'nova-sidebar-item-active' : ''}`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
// Header Component
function Header({ onMenuClick, showMenu = true }: { onMenuClick: () => void; showMenu?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="nova-navbar nova-sticky nova-top-0" style={{ zIndex: 30 }}>
      <div className="nova-flex nova-items-center nova-gap-3">
        {showMenu && (
          <button onClick={onMenuClick} className="nova-btn nova-btn-ghost nova-btn-sm lg:nova-hidden">
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="nova-font-bold nova-text-lg nova-flex nova-items-center nova-gap-2">
          <div className="nova-flex nova-items-center nova-justify-center" style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--nova-primary-500), var(--nova-secondary-500))', borderRadius: 'var(--nova-radius-md)' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>N</span>
          </div>
          <span className="nova-hidden sm:nova-inline-block">NOVA CSS</span>
        </Link>
      </div>
      <div className="nova-flex nova-items-center nova-gap-2">
        <div className="nova-hidden md:nova-flex nova-items-center nova-gap-1">
          <Link to="/" className="nova-navbar-link">Docs</Link>
          <Link to="/components/button" className="nova-navbar-link">Components</Link>
          <Link to="/playground" className="nova-navbar-link">Playground</Link>
        </div>
        <div className="nova-flex nova-items-center nova-gap-1 nova-p-1 nova-rounded-lg" style={{ backgroundColor: 'var(--nova-color-surface)' }}>
          <button 
            onClick={() => setTheme('light')} 
            className={`nova-btn nova-btn-xs ${theme === 'light' ? 'nova-bg-background nova-shadow-sm' : 'nova-btn-ghost'}`}
            title="Light mode"
          ><Sun size={14} /></button>
          <button 
            onClick={() => setTheme('dark')} 
            className={`nova-btn nova-btn-xs ${theme === 'dark' ? 'nova-bg-background nova-shadow-sm' : 'nova-btn-ghost'}`}
            title="Dark mode"
          ><Moon size={14} /></button>
        </div>
      </div>
    </header>
  );
}

// Code Block Component
function CodeBlock({ code, language = 'html' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="nova-relative nova-rounded-lg nova-overflow-hidden nova-my-4" style={{ backgroundColor: '#171717' }}>
      <div className="nova-flex nova-items-center nova-justify-between nova-px-4 nova-py-2" style={{ backgroundColor: 'var(--nova-neutral-800)' }}>
        <span className="nova-text-xs" style={{ color: 'var(--nova-neutral-400)' }}>{language}</span>
        <button onClick={handleCopy} className="nova-btn nova-btn-ghost nova-btn-xs nova-flex nova-items-center nova-gap-1" style={{ color: 'var(--nova-neutral-400)' }}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="nova-code-block nova-rounded-none nova-m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InstallCommand({ command }: { command: string }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <div className="nova-inline-flex nova-items-center nova-gap-4 nova-p-2 nova-pl-4 nova-rounded-lg nova-border nova-mb-6" style={{ backgroundColor: 'var(--nova-color-surface)', borderColor: 'var(--nova-color-border)' }}>
      <code className="nova-font-mono nova-text-sm">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copyStatus === 'copied' ? 'Command copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy install command'}
        className="nova-btn nova-btn-ghost nova-btn-sm nova-flex nova-items-center nova-gap-2"
      >
        {copyStatus === 'copied'
          ? <><Check size={14} /> Copied</>
          : copyStatus === 'failed'
            ? <><Copy size={14} /> Copy failed</>
            : <><Copy size={14} /> Copy</>}
      </button>
      <span className="nova-sr-only" aria-live="polite">
        {copyStatus === 'failed' ? 'Could not copy command. Copy it manually.' : ''}
      </span>
    </div>
  );
}

// Preview Component
function Preview({ children, code }: { children: React.ReactNode; code?: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="nova-border nova-rounded-xl nova-overflow-hidden nova-my-4">
      <div className="nova-p-6 nova-flex nova-items-center nova-justify-center" style={{ minHeight: 100 }}>
        {children}
      </div>
      {code && (
        <>
          <div className="nova-flex nova-justify-end nova-px-4 nova-py-2 nova-border-t" style={{ borderColor: 'var(--nova-color-border)' }}>
            <button onClick={() => setShowCode(!showCode)} className="nova-btn nova-btn-ghost nova-btn-xs">
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          {showCode && (
            <div className="nova-border-t" style={{ borderColor: 'var(--nova-color-border)' }}>
              <CodeBlock code={code} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Page Components
function HomePage() {
  return (
    <div>
      <div className="nova-text-center nova-py-12 md:nova-py-20">
        <InstallCommand command="npm i @putridinar/nova-css" />
        <h1 className="nova-text-4xl md:nova-text-5xl lg:nova-text-6xl nova-font-bold nova-tracking-tight nova-mb-4">
          Build faster with<br />
          <span style={{ background: 'linear-gradient(135deg, var(--nova-primary-500), var(--nova-secondary-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NOVA CSS
          </span>
        </h1>
        <p className="nova-text-lg md:nova-text-xl nova-text-muted nova-max-w-2xl nova-mx-auto nova-mb-8">
          A modern, lightweight, utility-first CSS framework with design tokens, 
          accessible components, and dark mode. Built for developers who value 
          performance and simplicity.
        </p>
        <div className="nova-flex nova-flex-wrap nova-items-center nova-justify-center nova-gap-3">
          <Link to="/installation" className="nova-btn nova-btn-primary nova-btn-lg">Get Started</Link>
          <Link to="/playground" className="nova-btn nova-btn-outline nova-btn-lg">Try Playground</Link>
        </div>
      </div>

      <div className="nova-grid nova-grid-cols-1 md:nova-grid-cols-3 nova-gap-6 nova-mb-12">
        {[
          { icon: <Zap size={24} className="nova-text-primary" />, title: 'Lightweight', desc: 'Minimal CSS output with CSS Layers and modern features. No bloat.' },
          { icon: <Palette size={24} className="nova-text-secondary" />, title: 'Design Tokens', desc: 'Complete token system with colors, spacing, typography, and more.' },
          { icon: <Puzzle size={24} className="nova-text-success" />, title: 'Components', desc: 'Accessible, composable UI components built on semantic HTML.' },
          { icon: <Smartphone size={24} className="nova-text-info" />, title: 'Responsive', desc: 'Mobile-first with breakpoint utilities and container queries.' },
          { icon: <MoonIcon size={24} className="nova-text-warning" />, title: 'Dark Mode', desc: 'Built-in dark mode with CSS custom properties. Light, dark, or system.' },
          { icon: <Accessibility size={24} className="nova-text-danger" />, title: 'Accessible', desc: 'WCAG 2.2 AA compliant. Keyboard navigation and screen reader support.' },
        ].map((feature) => (
          <div key={feature.title} className="nova-card">
            <div className="nova-card-body">
              <div className="nova-mb-3">{feature.icon}</div>
              <h3 className="nova-font-semibold nova-text-base nova-mb-2">{feature.title}</h3>
              <p className="nova-text-sm nova-text-muted">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nova-mb-12">
        <h2 className="nova-text-2xl nova-font-bold nova-mb-4">Quick Example</h2>
        <CodeBlock 
          language="html"
          code={`<div class="nova-flex nova-items-center nova-gap-4 nova-p-6">
  <button class="nova-btn nova-btn-primary nova-btn-md">
    Get Started
  </button>
  <span class="nova-badge nova-badge-success">New</span>
</div>`}
        />
        <Preview code='<div class="nova-flex nova-items-center nova-gap-4 nova-p-6">\n  <button class="nova-btn nova-btn-primary nova-btn-md">Get Started</button>\n  <span class="nova-badge nova-badge-success">New</span>\n</div>'>
          <div className="nova-flex nova-items-center nova-gap-4">
            <button className="nova-btn nova-btn-primary nova-btn-md">Get Started</button>
            <span className="nova-badge nova-badge-success">New</span>
          </div>
        </Preview>
      </div>

      <div className="nova-mb-12">
        <h2 className="nova-text-2xl nova-font-bold nova-mb-2">✨ Border Beam Effects</h2>
        <p className="nova-text-muted nova-mb-6">Add stunning animated gradient borders to your components. <Link to="/border-beam" className="nova-text-primary nova-font-medium">Learn more →</Link></p>
        <div className="nova-grid nova-grid-cols-1 sm:nova-grid-cols-2 lg:nova-grid-cols-3 nova-gap-4">
          <BorderBeam color="rainbow" className="nova-p-6">
            <div className="nova-text-center">
              <Palette size={24} className="nova-text-secondary nova-mx-auto nova-mb-2" />
              <h4 className="nova-font-semibold nova-text-sm nova-mb-1">Rainbow</h4>
              <p className="nova-text-xs nova-text-muted">Multi-color rotating</p>
            </div>
          </BorderBeam>
          <BorderBeam color="primary" className="nova-p-6">
            <div className="nova-text-center">
              <Zap size={24} className="nova-text-primary nova-mx-auto nova-mb-2" />
              <h4 className="nova-font-semibold nova-text-sm nova-mb-1">Primary</h4>
              <p className="nova-text-xs nova-text-muted">Smooth gradient beam</p>
            </div>
          </BorderBeam>
          <BorderBeam color="secondary" className="nova-p-6">
            <div className="nova-text-center">
              <Star size={24} className="nova-text-warning nova-mx-auto nova-mb-2" />
              <h4 className="nova-font-semibold nova-text-sm nova-mb-1">Secondary</h4>
              <p className="nova-text-xs nova-text-muted">Ambient glow effect</p>
            </div>
          </BorderBeam>
        </div>
      </div>

      <div className="nova-mb-12">
        <h2 className="nova-text-2xl nova-font-bold nova-mb-4">Installation</h2>
        <CodeBlock 
          language="bash"
          code={`# Install via npm
npm install @putridinar/nova-css

# Or with pnpm
pnpm add @putridinar/nova-css

# Import in your CSS
@import "@putridinar/nova-css";`}
        />
      </div>
    </div>
  );
}

function InstallationPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Installation</h1>
      <p className="nova-text-muted nova-mb-8">Get NOVA CSS up and running in your project.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Package Manager</h2>
      <CodeBlock language="bash" code={`# npm
npm install @putridinar/nova-css

# pnpm
pnpm add @putridinar/nova-css

# yarn
yarn add @putridinar/nova-css`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">CDN</h2>
      <CodeBlock language="html" code={`<link rel="stylesheet" href="https://unpkg.com/@putridinar/nova-css@latest/dist/index.css" />`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Import in CSS</h2>
      <CodeBlock language="css" code={`/* Import everything */
@import "@putridinar/nova-css";

/* Or import individual layers */
@import "@putridinar/nova-css/reset";
@import "@putridinar/nova-css/tokens";
@import "@putridinar/nova-css/utilities";
@import "@putridinar/nova-css/components";`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Import in JavaScript</h2>
      <CodeBlock language="js" code={`// In your main entry file
import "@putridinar/nova-css";

// Or with React components
import { BorderBeam } from "@putridinar/nova-css/react";`} />

      <div className="nova-alert nova-alert-info nova-mt-8">
        <Info size={18} />
        <div>
          <strong>Tip:</strong> NOVA CSS uses CSS Layers. You can override any style by adding your own CSS after the import without worrying about specificity.
        </div>
      </div>
    </div>
  );
}

function QuickStartPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Quick Start</h1>
      <p className="nova-text-muted nova-mb-8">Build your first page with NOVA CSS in under 5 minutes.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">1. Create HTML Structure</h2>
      <CodeBlock language="html" code={`<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="node_modules/@putridinar/nova-css/dist/index.css">
</head>
<body>
  <div class="nova-container nova-py-8">
    <h1 class="nova-text-3xl nova-font-bold nova-mb-4">Hello NOVA!</h1>
    <p class="nova-text-muted nova-mb-6">Welcome to your new project.</p>
    <button class="nova-btn nova-btn-primary nova-btn-md">
      Get Started
    </button>
  </div>
</body>
</html>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">2. Use Utilities</h2>
      <CodeBlock language="html" code={`<div class="nova-flex nova-flex-col md:nova-flex-row nova-gap-4 nova-p-6">
  <div class="nova-flex-1 nova-p-4 nova-bg-surface nova-rounded-lg">
    <h3 class="nova-font-semibold">Card One</h3>
    <p class="nova-text-sm nova-text-muted">Content here</p>
  </div>
  <div class="nova-flex-1 nova-p-4 nova-bg-surface nova-rounded-lg">
    <h3 class="nova-font-semibold">Card Two</h3>
    <p class="nova-text-sm nova-text-muted">Content here</p>
  </div>
</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">3. Use Components</h2>
      <CodeBlock language="html" code={`<!-- Alert -->
<div class="nova-alert nova-alert-success">
  <span>✓</span>
  <div>Operation completed successfully!</div>
</div>

<!-- Badge -->
<span class="nova-badge nova-badge-primary">New Feature</span>

<!-- Progress -->
<div class="nova-progress">
  <div class="nova-progress-bar" style="width: 75%"></div>
</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">4. Enable Dark Mode</h2>
      <CodeBlock language="html" code={`<!-- Set theme on HTML element -->
<html data-theme="dark">...</html>

<!-- Or use JavaScript -->
<script>
  document.documentElement.setAttribute('data-theme', 'dark');
</script>`} />
    </div>
  );
}

function ColorsPage() {
  const colorGroups = [
    { name: 'Primary', prefix: 'primary', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Secondary', prefix: 'secondary', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Success', prefix: 'success', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Warning', prefix: 'warning', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Danger', prefix: 'danger', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Info', prefix: 'info', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Neutral', prefix: 'neutral', colors: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  ];

  const colorMap: Record<string, Record<number, string>> = {
    primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
    secondary: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
    success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
    warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
    danger: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
    info: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
    neutral: { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' },
  };

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Colors</h1>
      <p className="nova-text-muted nova-mb-8">Complete color palette with semantic and primitive tokens.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Semantic Colors</h2>
      <div className="nova-grid nova-grid-cols-2 md:nova-grid-cols-3 nova-gap-4 nova-mb-8">
        {[
          { name: 'Primary', var: '--nova-color-primary', color: 'var(--nova-color-primary)' },
          { name: 'Secondary', var: '--nova-color-secondary', color: 'var(--nova-color-secondary)' },
          { name: 'Success', var: '--nova-color-success', color: 'var(--nova-color-success)' },
          { name: 'Warning', var: '--nova-color-warning', color: 'var(--nova-color-warning)' },
          { name: 'Danger', var: '--nova-color-danger', color: 'var(--nova-color-danger)' },
          { name: 'Info', var: '--nova-color-info', color: 'var(--nova-color-info)' },
        ].map((c) => (
          <div key={c.name} className="nova-flex nova-items-center nova-gap-3 nova-p-3 nova-border nova-rounded-lg">
            <div className="nova-rounded-md" style={{ width: 40, height: 40, backgroundColor: c.color }} />
            <div>
              <div className="nova-font-medium nova-text-sm">{c.name}</div>
              <code className="nova-text-xs nova-text-muted">{c.var}</code>
            </div>
          </div>
        ))}
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Color Scale</h2>
      {colorGroups.map((group) => (
        <div key={group.name} className="nova-mb-6">
          <h3 className="nova-font-medium nova-text-sm nova-mb-2 nova-text-muted">{group.name}</h3>
          <div className="nova-flex nova-rounded-lg nova-overflow-hidden">
            {group.colors.map((shade) => (
              <div
                key={shade}
                className="nova-flex-1 nova-flex nova-items-end nova-justify-center nova-p-2"
                style={{ backgroundColor: colorMap[group.prefix][shade], minHeight: 60 }}
                title={`--nova-${group.prefix}-${shade}`}
              >
                <span className="nova-text-xs nova-font-medium" style={{ color: shade >= 500 ? 'white' : 'inherit' }}>
                  {shade}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="css" code={`/* Using CSS variables */
.my-element {
  color: var(--nova-color-primary);
  background-color: var(--nova-primary-100);
  border-color: var(--nova-color-border);
}

/* Using utility classes */
<div class="nova-text-primary nova-bg-primary-100 nova-border-default">`} />
    </div>
  );
}

function TypographyPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Typography</h1>
      <p className="nova-text-muted nova-mb-8">Typography scale, font families, and text utilities.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Font Sizes</h2>
      <div className="nova-space-y-4 nova-mb-8">
        {[
          { name: 'text-xs', size: '0.75rem', class: 'nova-text-xs' },
          { name: 'text-sm', size: '0.875rem', class: 'nova-text-sm' },
          { name: 'text-base', size: '1rem', class: 'nova-text-base' },
          { name: 'text-lg', size: '1.125rem', class: 'nova-text-lg' },
          { name: 'text-xl', size: '1.25rem', class: 'nova-text-xl' },
          { name: 'text-2xl', size: '1.5rem', class: 'nova-text-2xl' },
          { name: 'text-3xl', size: '1.875rem', class: 'nova-text-3xl' },
          { name: 'text-4xl', size: '2.25rem', class: 'nova-text-4xl' },
          { name: 'text-5xl', size: '3rem', class: 'nova-text-5xl' },
        ].map((item) => (
          <div key={item.name} className="nova-flex nova-items-baseline nova-gap-4 nova-py-2 nova-border-b" style={{ borderColor: 'var(--nova-color-border)' }}>
            <code className="nova-text-xs nova-text-muted" style={{ minWidth: 100 }}>{item.name}</code>
            <span className={item.class}>The quick brown fox</span>
            <span className="nova-text-xs nova-text-muted nova-ml-auto">{item.size}</span>
          </div>
        ))}
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Font Weights</h2>
      <div className="nova-space-y-2 nova-mb-8">
        <p className="nova-font-normal">Normal (400) — The quick brown fox jumps over the lazy dog</p>
        <p className="nova-font-medium">Medium (500) — The quick brown fox jumps over the lazy dog</p>
        <p className="nova-font-semibold">Semibold (600) — The quick brown fox jumps over the lazy dog</p>
        <p className="nova-font-bold">Bold (700) — The quick brown fox jumps over the lazy dog</p>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Font Families</h2>
      <div className="nova-space-y-4 nova-mb-8">
        <div className="nova-p-4 nova-border nova-rounded-lg">
          <div className="nova-text-xs nova-text-muted nova-mb-1">Sans (default)</div>
          <p className="nova-font-sans nova-text-lg">The quick brown fox jumps over the lazy dog</p>
        </div>
        <div className="nova-p-4 nova-border nova-rounded-lg">
          <div className="nova-text-xs nova-text-muted nova-mb-1">Mono</div>
          <p className="nova-font-mono nova-text-lg">The quick brown fox jumps over the lazy dog</p>
        </div>
        <div className="nova-p-4 nova-border nova-rounded-lg">
          <div className="nova-text-xs nova-text-muted nova-mb-1">Serif</div>
          <p className="nova-font-serif nova-text-lg">The quick brown fox jumps over the lazy dog</p>
        </div>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Utilities</h2>
      <CodeBlock language="html" code={`<p class="nova-text-lg nova-font-semibold nova-tracking-tight">Heading text</p>
<p class="nova-text-sm nova-font-normal nova-text-muted">Body text</p>
<p class="nova-font-mono nova-text-xs">Code text</p>
<p class="nova-truncate">Truncated text that is too long to fit...</p>
<p class="nova-uppercase nova-tracking-wider nova-text-xs nova-font-semibold">Label</p>`} />
    </div>
  );
}

function SpacingPage() {
  const spacings = [
    { name: '0', value: '0' },
    { name: '1', value: '0.25rem' },
    { name: '2', value: '0.5rem' },
    { name: '3', value: '0.75rem' },
    { name: '4', value: '1rem' },
    { name: '5', value: '1.25rem' },
    { name: '6', value: '1.5rem' },
    { name: '8', value: '2rem' },
    { name: '10', value: '2.5rem' },
    { name: '12', value: '3rem' },
    { name: '16', value: '4rem' },
    { name: '20', value: '5rem' },
    { name: '24', value: '6rem' },
    { name: '32', value: '8rem' },
  ];

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Spacing</h1>
      <p className="nova-text-muted nova-mb-8">Consistent spacing scale for margin and padding.</p>

      <div className="nova-space-y-3">
        {spacings.map((s) => (
          <div key={s.name} className="nova-flex nova-items-center nova-gap-4">
            <code className="nova-text-xs" style={{ minWidth: 80 }}>space-{s.name}</code>
            <div className="nova-flex-1">
              <div className="nova-rounded-sm" style={{ width: s.value, height: 24, backgroundColor: 'var(--nova-color-primary)', minWidth: s.value === '0' ? 2 : undefined }} />
            </div>
            <code className="nova-text-xs nova-text-muted">{s.value}</code>
          </div>
        ))}
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<!-- Padding -->
<div class="nova-p-4">All sides padding</div>
<div class="nova-px-6 nova-py-4">Horizontal & vertical</div>
<div class="nova-pt-8">Top padding only</div>

<!-- Margin -->
<div class="nova-m-4">All sides margin</div>
<div class="nova-mx-auto">Centered horizontally</div>
<div class="nova-mb-6">Bottom margin</div>

<!-- Gap (flexbox/grid) -->
<div class="nova-flex nova-gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>`} />
    </div>
  );
}

function ShadowsPage() {
  const shadows = [
    { name: 'shadow-xs', value: 'var(--nova-shadow-xs)' },
    { name: 'shadow-sm', value: 'var(--nova-shadow-sm)' },
    { name: 'shadow-md', value: 'var(--nova-shadow-md)' },
    { name: 'shadow-lg', value: 'var(--nova-shadow-lg)' },
    { name: 'shadow-xl', value: 'var(--nova-shadow-xl)' },
    { name: 'shadow-2xl', value: 'var(--nova-shadow-2xl)' },
  ];

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Shadows</h1>
      <p className="nova-text-muted nova-mb-8">Elevation system for depth and hierarchy.</p>

      <div className="nova-grid nova-grid-cols-2 md:nova-grid-cols-3 nova-gap-6">
        {shadows.map((s) => (
          <div key={s.name} className="nova-flex nova-flex-col nova-items-center nova-gap-3">
            <div 
              className="nova-rounded-xl nova-p-8 nova-flex nova-items-center nova-justify-center nova-w-full"
              style={{ boxShadow: s.value, backgroundColor: 'var(--nova-color-background)', minHeight: 100 }}
            >
              <span className="nova-text-sm nova-font-medium">{s.name}</span>
            </div>
            <code className="nova-text-xs nova-text-muted">{s.value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaygroundPage() {
  const [html, setHtml] = useState(`<div class="nova-flex nova-flex-col nova-items-center nova-gap-6 nova-p-8">
  <h1 class="nova-text-2xl nova-font-bold">Hello NOVA CSS!</h1>
  <p class="nova-text-muted">Edit this code to see changes live.</p>
  
  <!-- Border Beam Examples -->
  <div class="nova-grid nova-grid-cols-2 nova-gap-4 nova-w-full nova-max-w-lg">
    <div class="nova-border-beam nova-border-beam--primary">
      <div class="nova-border-beam__content nova-p-4 nova-text-center">
        <p class="nova-text-sm nova-font-medium">Primary</p>
      </div>
    </div>
    <div class="nova-border-beam nova-border-beam--rainbow">
      <div class="nova-border-beam__content nova-p-4 nova-text-center">
        <p class="nova-text-sm nova-font-medium">Rainbow</p>
      </div>
    </div>
  </div>
  
  <div class="nova-flex nova-gap-3">
    <button class="nova-btn nova-btn-primary nova-btn-md">Primary</button>
    <button class="nova-btn nova-btn-outline nova-btn-md">Outline</button>
    <button class="nova-btn nova-btn-ghost nova-btn-md">Ghost</button>
  </div>
  
  <div class="nova-flex nova-gap-2">
    <span class="nova-badge nova-badge-primary">Primary</span>
    <span class="nova-badge nova-badge-success">Success</span>
    <span class="nova-badge nova-badge-warning">Warning</span>
    <span class="nova-badge nova-badge-danger">Danger</span>
  </div>
  
  <div class="nova-border-beam nova-border-beam--secondary nova-border-beam--lg nova-w-full nova-max-w-md">
    <div class="nova-border-beam__content">
      <div class="nova-card-body">
        <h3 class="nova-font-semibold nova-mb-2">Card with Border Beam</h3>
        <p class="nova-text-sm nova-text-muted">This card has an animated gradient border with ambient glow.</p>
        <div class="nova-progress nova-mt-3">
          <div class="nova-progress-bar" style="width: 65%"></div>
        </div>
      </div>
    </div>
  </div>
</div>`);

  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Playground</h1>
      <p className="nova-text-muted nova-mb-4">Write HTML with NOVA CSS classes and see the result in real-time.</p>

      <div className="nova-flex nova-items-center nova-gap-2 nova-mb-4">
        <button 
          onClick={() => setPreviewTheme('light')} 
          className={`nova-btn nova-btn-sm ${previewTheme === 'light' ? 'nova-btn-primary' : 'nova-btn-outline'}`}
        >Light</button>
        <button 
          onClick={() => setPreviewTheme('dark')} 
          className={`nova-btn nova-btn-sm ${previewTheme === 'dark' ? 'nova-btn-primary' : 'nova-btn-outline'}`}
        >Dark</button>
        <div className="nova-flex-1" />
        <button 
          onClick={() => setHtml('')} 
          className="nova-btn nova-btn-ghost nova-btn-sm"
        >Reset</button>
      </div>

      <div className="nova-grid nova-grid-cols-1 lg:nova-grid-cols-2 nova-gap-4" style={{ minHeight: 500 }}>
        <div className="nova-flex nova-flex-col">
          <div className="nova-flex nova-items-center nova-justify-between nova-px-3 nova-py-2 nova-border nova-rounded-t-lg" style={{ borderColor: 'var(--nova-color-border)', backgroundColor: 'var(--nova-color-surface)' }}>
            <span className="nova-text-xs nova-font-medium">HTML</span>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="nova-flex-1 nova-p-4 nova-font-mono nova-text-sm nova-border nova-rounded-b-lg nova-resize-none"
            style={{ borderColor: 'var(--nova-color-border)', minHeight: 400, backgroundColor: 'var(--nova-color-background)' }}
            spellCheck={false}
          />
        </div>
        <div className="nova-flex nova-flex-col">
          <div className="nova-flex nova-items-center nova-justify-between nova-px-3 nova-py-2 nova-border nova-rounded-t-lg" style={{ borderColor: 'var(--nova-color-border)', backgroundColor: 'var(--nova-color-surface)' }}>
            <span className="nova-text-xs nova-font-medium">Preview</span>
          </div>
          <div 
            className="nova-flex-1 nova-border nova-rounded-b-lg nova-overflow-auto nova-p-4"
            style={{ borderColor: 'var(--nova-color-border)', minHeight: 400, backgroundColor: previewTheme === 'dark' ? 'var(--nova-neutral-950)' : 'var(--nova-color-background)' }}
            data-theme={previewTheme}
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkModePage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Dark Mode</h1>
      <p className="nova-text-muted nova-mb-8">Built-in dark mode support with CSS custom properties.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">How It Works</h2>
      <p className="nova-text-sm nova-text-muted nova-mb-4">
        NOVA CSS uses the <code className="nova-code">data-theme</code> attribute on the HTML element to switch between light and dark modes. All colors are defined as CSS custom properties that automatically adapt.
      </p>

      <CodeBlock language="html" code={`<!-- Light mode (default) -->
<html data-theme="light">...</html>

<!-- Dark mode -->
<html data-theme="dark">...</html>

<!-- System preference -->
<html data-theme="system">...</html>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">JavaScript Toggle</h2>
      <CodeBlock language="js" code={`// Set theme
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nova-theme', theme);
}

// Initialize from storage or system preference
const saved = localStorage.getItem('nova-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (prefersDark ? 'dark' : 'light'));`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Custom Dark Mode Colors</h2>
      <CodeBlock language="css" code={`/* Override dark mode tokens */
[data-theme="dark"] {
  --nova-color-primary: #60a5fa;
  --nova-color-background: #0f172a;
  --nova-color-surface: #1e293b;
  --nova-color-text: #f1f5f9;
  --nova-color-border: #334155;
}`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Preview</h2>
      <div className="nova-grid nova-grid-cols-2 nova-gap-4">
        <div className="nova-p-6 nova-border nova-rounded-xl" data-theme="light">
          <h4 className="nova-font-semibold nova-mb-2">Light Mode</h4>
          <p className="nova-text-sm nova-text-muted nova-mb-3">Default appearance</p>
          <button className="nova-btn nova-btn-primary nova-btn-sm">Button</button>
        </div>
        <div className="nova-p-6 nova-border nova-rounded-xl" data-theme="dark" style={{ backgroundColor: 'var(--nova-neutral-950)' }}>
          <h4 className="nova-font-semibold nova-mb-2" style={{ color: 'var(--nova-neutral-50)' }}>Dark Mode</h4>
          <p className="nova-text-sm nova-mb-3" style={{ color: 'var(--nova-neutral-400)' }}>Dark appearance</p>
          <button className="nova-btn nova-btn-primary nova-btn-sm">Button</button>
        </div>
      </div>
    </div>
  );
}

function ThemingPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Theming</h1>
      <p className="nova-text-muted nova-mb-8">Customize NOVA CSS to match your brand.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Override Tokens</h2>
      <p className="nova-text-sm nova-text-muted nova-mb-4">
        All design tokens are CSS custom properties. Override them in your own CSS to customize the entire framework.
      </p>
      <CodeBlock language="css" code={`:root {
  /* Colors */
  --nova-color-primary: #6366f1;
  --nova-color-secondary: #ec4899;
  
  /* Typography */
  --nova-font-sans: 'Your Font', sans-serif;
  --nova-font-mono: 'Your Mono', monospace;
  
  /* Border Radius */
  --nova-radius-md: 0.5rem;
  --nova-radius-lg: 0.75rem;
  
  /* Shadows */
  --nova-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
}`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Configuration Object</h2>
      <p className="nova-text-sm nova-text-muted nova-mb-4">
        For build-time customization, use the configuration object:
      </p>
      <CodeBlock language="ts" code={`// nova.config.ts
export default {
  theme: {
    colors: {
      primary: {
        50: '#eef2ff',
        500: '#6366f1',
        900: '#312e81',
      },
    },
    spacing: {
      // Custom spacing values
    },
    typography: {
      fontFamily: {
        sans: ['Your Font', 'sans-serif'],
      },
    },
    borderRadius: {
      md: '0.5rem',
      lg: '0.75rem',
    },
  },
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
};`} />
    </div>
  );
}

function BorderBeamPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Border Beam</h1>
      <p className="nova-text-muted nova-mb-8">Animated gradient border beam inspired by Magic UI. Uses conic-gradient + @property for smooth rotation with ambient glow effect.</p>

      <div className="nova-alert nova-alert-info nova-flex nova-items-start nova-gap-3 nova-mb-8">
        <Info size={18} className="nova-flex-shrink-0 nova-mt-0-5" />
        <div>
          <strong>How it works:</strong> Uses <code className="nova-code">@property --nova-beam-angle</code> for smooth angle animation, <code className="nova-code">conic-gradient</code> for the rotating beam, and <code className="nova-code">::after</code> with blur for ambient glow.
        </div>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Basic Usage</h2>
      <Preview code='<div class="nova-border-beam">\n  <div class="nova-border-beam__content nova-p-8">\n    <p>Animated gradient border</p>\n  </div>\n</div>'>
        <BorderBeam>
          <div className="nova-p-8 nova-text-center">
            <p className="nova-font-medium">Animated Gradient Border</p>
            <p className="nova-text-sm nova-text-muted nova-mt-2">Smooth rotating beam with ambient glow</p>
          </div>
        </BorderBeam>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-10 nova-mb-4">Color Themes</h2>
      <div className="nova-grid nova-grid-cols-2 md:nova-grid-cols-3 nova-gap-4">
        {(['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const).map((color) => (
          <BorderBeam key={color} color={color}>
            <div className="nova-p-5 nova-text-center">
              <p className="nova-text-sm nova-font-medium nova-capitalize">{color}</p>
            </div>
          </BorderBeam>
        ))}
      </div>

      <h3 className="nova-text-base nova-font-medium nova-mt-8 nova-mb-3 nova-text-muted">Rainbow (Multi-color)</h3>
      <Preview code='<div class="nova-border-beam nova-border-beam--rainbow">\n  <div class="nova-border-beam__content nova-p-8">\n    <p>Rainbow beam</p>\n  </div>\n</div>'>
        <BorderBeam color="rainbow">
          <div className="nova-p-8 nova-text-center">
            <p className="nova-font-medium">Rainbow Beam</p>
            <p className="nova-text-sm nova-text-muted nova-mt-2">Multi-color conic gradient</p>
          </div>
        </BorderBeam>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-10 nova-mb-4">Sizes</h2>
      <div className="nova-grid nova-grid-cols-1 md:nova-grid-cols-3 nova-gap-4">
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Small (1px)</p>
          <BorderBeam size="sm">
            <div className="nova-p-4 nova-text-center nova-text-sm">Small</div>
          </BorderBeam>
        </div>
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Medium (1.5px)</p>
          <BorderBeam size="md">
            <div className="nova-p-4 nova-text-center nova-text-sm">Medium</div>
          </BorderBeam>
        </div>
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Large (2px)</p>
          <BorderBeam size="lg">
            <div className="nova-p-4 nova-text-center nova-text-sm">Large</div>
          </BorderBeam>
        </div>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-10 nova-mb-4">Speed</h2>
      <div className="nova-grid nova-grid-cols-1 md:nova-grid-cols-3 nova-gap-4">
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Slow (14s)</p>
          <BorderBeam speed="slow">
            <div className="nova-p-4 nova-text-center nova-text-sm">Slow</div>
          </BorderBeam>
        </div>
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Normal (8s)</p>
          <BorderBeam speed="normal">
            <div className="nova-p-4 nova-text-center nova-text-sm">Normal</div>
          </BorderBeam>
        </div>
        <div>
          <p className="nova-text-sm nova-font-medium nova-mb-2 nova-text-muted">Fast (4s)</p>
          <BorderBeam speed="fast">
            <div className="nova-p-4 nova-text-center nova-text-sm">Fast</div>
          </BorderBeam>
        </div>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-10 nova-mb-4">Real-world Examples</h2>
      
      <h3 className="nova-text-base nova-font-medium nova-mb-3 nova-text-muted">Pricing Card</h3>
      <Preview>
        <BorderBeam color="rainbow" size="lg">
          <div className="nova-card-body nova-text-center">
            <h3 className="nova-text-lg nova-font-bold nova-mb-2">Pro Plan</h3>
            <div className="nova-text-3xl nova-font-bold nova-text-primary nova-mb-2">$29<span className="nova-text-sm nova-font-normal nova-text-muted">/mo</span></div>
            <p className="nova-text-sm nova-text-muted nova-mb-4">Perfect for growing teams</p>
            <button className="nova-btn nova-btn-primary nova-btn-md nova-w-full">Get Started</button>
          </div>
        </BorderBeam>
      </Preview>

      <h3 className="nova-text-base nova-font-medium nova-mt-6 nova-mb-3 nova-text-muted">Feature Highlight</h3>
      <Preview>
        <BorderBeam color="success" size="lg">
          <div className="nova-p-6">
            <div className="nova-flex nova-items-center nova-gap-4">
              <div className="nova-flex nova-items-center nova-justify-center nova-w-12 nova-h-12 nova-rounded-full" style={{ backgroundColor: 'var(--nova-success-100)' }}>
                <CheckCircle size={24} className="nova-text-success" />
              </div>
              <div>
                <h4 className="nova-font-semibold nova-mb-1">Premium Feature</h4>
                <p className="nova-text-sm nova-text-muted">Unlock advanced capabilities</p>
              </div>
            </div>
          </div>
        </BorderBeam>
      </Preview>

      <h3 className="nova-text-base nova-font-medium nova-mt-6 nova-mb-3 nova-text-muted">CTA Button</h3>
      <Preview>
        <BorderBeam color="secondary" size="sm" speed="fast" withContent={false}>
          <button className="nova-btn nova-btn-primary nova-btn-lg">
            <Star size={18} />
            Upgrade to Pro
          </button>
        </BorderBeam>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-10 nova-mb-3">HTML Usage</h2>
      <CodeBlock language="html" code={`<!-- Basic border beam -->
<div class="nova-border-beam">
  <div class="nova-border-beam__content nova-p-8">
    Content here
  </div>
</div>

<!-- With color theme -->
<div class="nova-border-beam nova-border-beam--primary">
  <div class="nova-border-beam__content nova-p-8">
    Primary color beam
  </div>
</div>

<!-- Rainbow multi-color -->
<div class="nova-border-beam nova-border-beam--rainbow">
  <div class="nova-border-beam__content nova-p-8">
    Rainbow beam
  </div>
</div>

<!-- With size and speed -->
<div class="nova-border-beam nova-border-beam--lg nova-border-beam--fast">
  <div class="nova-border-beam__content nova-p-8">
    Large and fast
  </div>
</div>

<!-- Combine modifiers -->
<div class="nova-border-beam nova-border-beam--success nova-border-beam--lg nova-border-beam--slow">
  <div class="nova-border-beam__content nova-p-8">
    Success, large, slow
  </div>
</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">React Component</h2>
      <CodeBlock language="tsx" code={`import { BorderBeam } from '@putridinar/nova-css/react';

function MyComponent() {
  return (
    <BorderBeam 
      color="primary" 
      size="md" 
      speed="normal"
    >
      <div className="nova-p-8">
        <h3>My Content</h3>
      </div>
    </BorderBeam>
  );
}

// Preset components
<BorderBeamCard color="rainbow">Card content</BorderBeamCard>
<BorderBeamButton color="secondary">Click me</BorderBeamButton>
<BorderBeamBadge color="success">Badge</BorderBeamBadge>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Custom CSS Variables</h2>
      <p className="nova-text-sm nova-text-muted nova-mb-3">Override tokens for custom effects:</p>
      <CodeBlock language="css" code={`.my-custom-beam {
  --nova-beam-color-from: #ff0080;
  --nova-beam-color-to: #7928ca;
  --nova-beam-duration: 6s;
  --nova-beam-border-width: 2px;
  --nova-beam-radius: 1rem;
}`} />
    </div>
  );
}

function ButtonPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Button</h1>
      <p className="nova-text-muted nova-mb-8">Interactive button component with multiple variants and sizes.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Variants</h2>
      <Preview code='<button class="nova-btn nova-btn-primary nova-btn-md">Primary</button>\n<button class="nova-btn nova-btn-secondary nova-btn-md">Secondary</button>\n<button class="nova-btn nova-btn-outline nova-btn-md">Outline</button>\n<button class="nova-btn nova-btn-ghost nova-btn-md">Ghost</button>\n<button class="nova-btn nova-btn-danger nova-btn-md">Danger</button>\n<button class="nova-btn nova-btn-success nova-btn-md">Success</button>'>
        <div className="nova-flex nova-flex-wrap nova-gap-3">
          <button className="nova-btn nova-btn-primary nova-btn-md">Primary</button>
          <button className="nova-btn nova-btn-secondary nova-btn-md">Secondary</button>
          <button className="nova-btn nova-btn-outline nova-btn-md">Outline</button>
          <button className="nova-btn nova-btn-ghost nova-btn-md">Ghost</button>
          <button className="nova-btn nova-btn-danger nova-btn-md">Danger</button>
          <button className="nova-btn nova-btn-success nova-btn-md">Success</button>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Sizes</h2>
      <Preview code='<button class="nova-btn nova-btn-primary nova-btn-xs">Extra Small</button>\n<button class="nova-btn nova-btn-primary nova-btn-sm">Small</button>\n<button class="nova-btn nova-btn-primary nova-btn-md">Medium</button>\n<button class="nova-btn nova-btn-primary nova-btn-lg">Large</button>\n<button class="nova-btn nova-btn-primary nova-btn-xl">Extra Large</button>'>
        <div className="nova-flex nova-flex-wrap nova-items-center nova-gap-3">
          <button className="nova-btn nova-btn-primary nova-btn-xs">Extra Small</button>
          <button className="nova-btn nova-btn-primary nova-btn-sm">Small</button>
          <button className="nova-btn nova-btn-primary nova-btn-md">Medium</button>
          <button className="nova-btn nova-btn-primary nova-btn-lg">Large</button>
          <button className="nova-btn nova-btn-primary nova-btn-xl">Extra Large</button>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Button Group</h2>
      <Preview code='<div class="nova-btn-group">\n  <button class="nova-btn nova-btn-outline nova-btn-md">Left</button>\n  <button class="nova-btn nova-btn-outline nova-btn-md">Center</button>\n  <button class="nova-btn nova-btn-outline nova-btn-md">Right</button>\n</div>'>
        <div className="nova-btn-group">
          <button className="nova-btn nova-btn-outline nova-btn-md">Left</button>
          <button className="nova-btn nova-btn-outline nova-btn-md">Center</button>
          <button className="nova-btn nova-btn-outline nova-btn-md">Right</button>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Disabled State</h2>
      <Preview code='<button class="nova-btn nova-btn-primary nova-btn-md" disabled>Disabled</button>'>
        <button className="nova-btn nova-btn-primary nova-btn-md" disabled>Disabled</button>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Button with Border Beam</h2>
      <Preview>
        <div className="nova-flex nova-flex-wrap nova-gap-4">
          <BorderBeam color="secondary" size="sm" speed="fast" withContent={false}>
            <button className="nova-btn nova-btn-primary nova-btn-md">
              <Star size={16} />
              Secondary Beam
            </button>
          </BorderBeam>
          <BorderBeam color="rainbow" size="sm" withContent={false}>
            <button className="nova-btn nova-btn-secondary nova-btn-md">
              <Zap size={16} />
              Rainbow Beam
            </button>
          </BorderBeam>
          <BorderBeam color="success" size="sm" withContent={false}>
            <button className="nova-btn nova-btn-success nova-btn-md">
              <Check size={16} />
              Success Beam
            </button>
          </BorderBeam>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<!-- Basic button -->
<button class="nova-btn nova-btn-primary nova-btn-md">Click me</button>

<!-- With icon -->
<button class="nova-btn nova-btn-primary nova-btn-md">
  <svg>...</svg>
  Save
</button>

<!-- As link -->
<a href="/page" class="nova-btn nova-btn-outline nova-btn-md">
  Learn More
</a>

<!-- Button group -->
<div class="nova-btn-group">
  <button class="nova-btn nova-btn-outline nova-btn-md">A</button>
  <button class="nova-btn nova-btn-outline nova-btn-md">B</button>
</div>`} />
    </div>
  );
}

function InputPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Input</h1>
      <p className="nova-text-muted nova-mb-8">Form input components with validation states.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Text Input</h2>
      <Preview code='<div class="nova-form-group">\n  <label class="nova-label">Email</label>\n  <input class="nova-input" type="email" placeholder="you@example.com" />\n</div>'>
        <div className="nova-w-full nova-max-w-sm">
          <div className="nova-form-group">
            <label className="nova-label">Email</label>
            <input className="nova-input" type="email" placeholder="you@example.com" />
          </div>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Sizes</h2>
      <Preview>
        <div className="nova-flex nova-flex-col nova-gap-3 nova-w-full nova-max-w-sm">
          <input className="nova-input nova-input-sm" placeholder="Small input" />
          <input className="nova-input" placeholder="Default input" />
          <input className="nova-input nova-input-lg" placeholder="Large input" />
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Textarea</h2>
      <Preview>
        <div className="nova-w-full nova-max-w-sm">
          <label className="nova-label">Message</label>
          <textarea className="nova-textarea" placeholder="Write your message..." rows={3}></textarea>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Select</h2>
      <Preview>
        <div className="nova-w-full nova-max-w-sm">
          <label className="nova-label">Country</label>
          <select className="nova-select">
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
          </select>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Error State</h2>
      <Preview>
        <div className="nova-w-full nova-max-w-sm">
          <div className="nova-form-group">
            <label className="nova-label">Email</label>
            <input className="nova-input nova-input-error" type="email" defaultValue="invalid-email" />
            <div className="nova-form-error">Please enter a valid email address.</div>
          </div>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<div class="nova-form-group">
  <label class="nova-label" for="email">Email</label>
  <input class="nova-input" id="email" type="email" placeholder="you@example.com" />
  <div class="nova-form-help">We'll never share your email.</div>
</div>

<!-- Error state -->
<input class="nova-input nova-input-error" />
<div class="nova-form-error">This field is required.</div>

<!-- Textarea -->
<textarea class="nova-textarea" rows="4"></textarea>

<!-- Select -->
<select class="nova-select">
  <option>Option 1</option>
</select>`} />
    </div>
  );
}

function CardPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Card</h1>
      <p className="nova-text-muted nova-mb-8">Container component for grouping related content.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Basic Card</h2>
      <Preview code='<div class="nova-card nova-max-w-sm">\n  <div class="nova-card-body">\n    <h3 class="nova-font-semibold nova-mb-2">Card Title</h3>\n    <p class="nova-text-sm nova-text-muted">Card content goes here.</p>\n  </div>\n</div>'>
        <div className="nova-card nova-max-w-sm nova-w-full">
          <div className="nova-card-body">
            <h3 className="nova-font-semibold nova-mb-2">Card Title</h3>
            <p className="nova-text-sm nova-text-muted">This is a basic card with some content inside it.</p>
          </div>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Card with Header & Footer</h2>
      <Preview>
        <div className="nova-card nova-max-w-sm nova-w-full">
          <div className="nova-card-header">
            <h3 className="nova-font-semibold">Card Header</h3>
          </div>
          <div className="nova-card-body">
            <p className="nova-text-sm nova-text-muted">Card body content with more details and information.</p>
          </div>
          <div className="nova-card-footer">
            <div className="nova-flex nova-justify-end nova-gap-2">
              <button className="nova-btn nova-btn-ghost nova-btn-sm">Cancel</button>
              <button className="nova-btn nova-btn-primary nova-btn-sm">Save</button>
            </div>
          </div>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Card Grid</h2>
      <Preview>
        <div className="nova-grid nova-grid-cols-1 sm:nova-grid-cols-2 lg:nova-grid-cols-3 nova-gap-4 nova-w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="nova-card">
              <div className="nova-card-body">
                <div className="nova-flex nova-items-center nova-gap-3 nova-mb-3">
                  <div className="nova-avatar nova-avatar-md">A</div>
                  <div>
                    <div className="nova-font-medium nova-text-sm">Item {i}</div>
                    <div className="nova-text-xs nova-text-muted">Description</div>
                  </div>
                </div>
                <p className="nova-text-sm nova-text-muted">Card content with useful information.</p>
                <div className="nova-flex nova-gap-2 nova-mt-3">
                  <span className="nova-badge nova-badge-primary">Tag</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Card with Border Beam</h2>
      <Preview>
        <div className="nova-grid nova-grid-cols-1 sm:nova-grid-cols-2 nova-gap-4 nova-w-full">
          <BorderBeam color="rainbow" size="lg">
            <div className="nova-card-body">
              <div className="nova-flex nova-items-center nova-gap-2 nova-mb-3">
                <Star size={18} className="nova-text-warning" />
                <h3 className="nova-font-semibold">Premium</h3>
              </div>
              <p className="nova-text-sm nova-text-muted nova-mb-3">Unlock all features with our premium plan.</p>
              <button className="nova-btn nova-btn-primary nova-btn-sm nova-w-full">Upgrade Now</button>
            </div>
          </BorderBeam>
          <BorderBeam color="success" size="lg">
            <div className="nova-card-body">
              <div className="nova-flex nova-items-center nova-gap-2 nova-mb-3">
                <CheckCircle size={18} className="nova-text-success" />
                <h3 className="nova-font-semibold">Active</h3>
              </div>
              <p className="nova-text-sm nova-text-muted nova-mb-3">Your subscription is active and running.</p>
              <div className="nova-progress">
                <div className="nova-progress-bar" style={{ width: '75%', backgroundColor: 'var(--nova-color-success)' }}></div>
              </div>
            </div>
          </BorderBeam>
        </div>
      </Preview>
    </div>
  );
}

function BadgePage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Badge</h1>
      <p className="nova-text-muted nova-mb-8">Small status indicators and labels.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Variants</h2>
      <Preview code='<span class="nova-badge nova-badge-primary">Primary</span>\n<span class="nova-badge nova-badge-secondary">Secondary</span>\n<span class="nova-badge nova-badge-success">Success</span>\n<span class="nova-badge nova-badge-warning">Warning</span>\n<span class="nova-badge nova-badge-danger">Danger</span>\n<span class="nova-badge nova-badge-info">Info</span>\n<span class="nova-badge nova-badge-neutral">Neutral</span>'>
        <div className="nova-flex nova-flex-wrap nova-gap-2">
          <span className="nova-badge nova-badge-primary">Primary</span>
          <span className="nova-badge nova-badge-secondary">Secondary</span>
          <span className="nova-badge nova-badge-success">Success</span>
          <span className="nova-badge nova-badge-warning">Warning</span>
          <span className="nova-badge nova-badge-danger">Danger</span>
          <span className="nova-badge nova-badge-info">Info</span>
          <span className="nova-badge nova-badge-neutral">Neutral</span>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<span class="nova-badge nova-badge-primary">New</span>
<span class="nova-badge nova-badge-success">Active</span>
<span class="nova-badge nova-badge-danger">Deleted</span>

<!-- With icon -->
<span class="nova-badge nova-badge-info">
  <svg>...</svg>
  Beta
</span>`} />
    </div>
  );
}

function AlertPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Alert</h1>
      <p className="nova-text-muted nova-mb-8">Contextual feedback messages for user actions.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Variants</h2>
      <div className="nova-space-y-3">
        <Preview>
          <div className="nova-space-y-3 nova-w-full">
            <div className="nova-alert nova-alert-primary nova-flex nova-items-start nova-gap-3"><Info size={18} className="nova-flex-shrink-0 nova-mt-0-5" /><div><strong>Info:</strong> This is an informational message.</div></div>
            <div className="nova-alert nova-alert-success nova-flex nova-items-start nova-gap-3"><CheckCircle size={18} className="nova-flex-shrink-0 nova-mt-0-5" /><div><strong>Success:</strong> Operation completed successfully.</div></div>
            <div className="nova-alert nova-alert-warning nova-flex nova-items-start nova-gap-3"><AlertTriangle size={18} className="nova-flex-shrink-0 nova-mt-0-5" /><div><strong>Warning:</strong> Please review before proceeding.</div></div>
            <div className="nova-alert nova-alert-danger nova-flex nova-items-start nova-gap-3"><AlertCircle size={18} className="nova-flex-shrink-0 nova-mt-0-5" /><div><strong>Error:</strong> Something went wrong.</div></div>
          </div>
        </Preview>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<div class="nova-alert nova-alert-success">
  <span>✓</span>
  <div>
    <strong>Success!</strong> Your changes have been saved.
  </div>
</div>`} />
    </div>
  );
}

function TablePage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Table</h1>
      <p className="nova-text-muted nova-mb-8">Data table component for displaying structured information.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Basic Table</h2>
      <Preview>
        <div className="nova-w-full nova-overflow-x-auto">
          <table className="nova-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="nova-font-medium">John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td><span className="nova-badge nova-badge-success">Active</span></td>
              </tr>
              <tr>
                <td className="nova-font-medium">Jane Smith</td>
                <td>jane@example.com</td>
                <td>Editor</td>
                <td><span className="nova-badge nova-badge-success">Active</span></td>
              </tr>
              <tr>
                <td className="nova-font-medium">Bob Wilson</td>
                <td>bob@example.com</td>
                <td>Viewer</td>
                <td><span className="nova-badge nova-badge-warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<table class="nova-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td><span class="nova-badge nova-badge-success">Active</span></td>
    </tr>
  </tbody>
</table>`} />
    </div>
  );
}

function ModalPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Modal</h1>
      <p className="nova-text-muted nova-mb-8">Dialog overlay for focused interactions.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Example</h2>
      <Preview>
        <button className="nova-btn nova-btn-primary nova-btn-md" onClick={() => setIsOpen(true)}>
          Open Modal
        </button>
        {isOpen && (
          <div className="nova-modal-backdrop" onClick={() => setIsOpen(false)}>
            <div className="nova-modal" onClick={(e) => e.stopPropagation()}>
              <div className="nova-modal-header">
                <h3 className="nova-modal-title">Confirm Action</h3>
                <button className="nova-modal-close" onClick={() => setIsOpen(false)}><X size={18} /></button>
              </div>
              <div className="nova-modal-body">
                <p className="nova-text-sm nova-text-muted">Are you sure you want to proceed? This action cannot be undone.</p>
              </div>
              <div className="nova-modal-footer">
                <button className="nova-btn nova-btn-ghost nova-btn-md" onClick={() => setIsOpen(false)}>Cancel</button>
                <button className="nova-btn nova-btn-primary nova-btn-md" onClick={() => setIsOpen(false)}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<!-- Backdrop -->
<div class="nova-modal-backdrop">
  <div class="nova-modal">
    <div class="nova-modal-header">
      <h3 class="nova-modal-title">Title</h3>
      <button class="nova-modal-close">✕</button>
    </div>
    <div class="nova-modal-body">
      <p>Content goes here.</p>
    </div>
    <div class="nova-modal-footer">
      <button class="nova-btn nova-btn-ghost nova-btn-md">Cancel</button>
      <button class="nova-btn nova-btn-primary nova-btn-md">Confirm</button>
    </div>
  </div>
</div>`} />
    </div>
  );
}

function TabsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Overview', 'Features', 'Pricing'];

  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Tabs</h1>
      <p className="nova-text-muted nova-mb-8">Tab navigation for switching between content panels.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Example</h2>
      <Preview>
        <div className="nova-w-full nova-max-w-lg">
          <div className="nova-tabs" role="tablist">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`nova-tab ${activeTab === i ? 'nova-tab-active' : ''}`}
                onClick={() => setActiveTab(i)}
                role="tab"
                aria-selected={activeTab === i}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="nova-p-4">
            {activeTab === 0 && <p className="nova-text-sm nova-text-muted">Overview content goes here. This is the default tab.</p>}
            {activeTab === 1 && <p className="nova-text-sm nova-text-muted">Features content. Explore all the capabilities.</p>}
            {activeTab === 2 && <p className="nova-text-sm nova-text-muted">Pricing content. Choose the plan that works for you.</p>}
          </div>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<div class="nova-tabs" role="tablist">
  <button class="nova-tab nova-tab-active" role="tab">Tab 1</button>
  <button class="nova-tab" role="tab">Tab 2</button>
  <button class="nova-tab" role="tab">Tab 3</button>
</div>
<div class="nova-p-4">
  <!-- Tab content -->
</div>`} />
    </div>
  );
}

function NavigationPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Navigation</h1>
      <p className="nova-text-muted nova-mb-8">Navbar and sidebar navigation components.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Navbar</h2>
      <Preview>
        <div className="nova-w-full">
          <nav className="nova-navbar nova-rounded-lg nova-border" style={{ borderBlockEnd: '1px solid var(--nova-color-border)' }}>
            <span className="nova-navbar-brand">MyApp</span>
            <div className="nova-navbar-nav">
              <a href="#" className="nova-navbar-link nova-navbar-link-active">Home</a>
              <a href="#" className="nova-navbar-link">Docs</a>
              <a href="#" className="nova-navbar-link">About</a>
            </div>
          </nav>
        </div>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Breadcrumb</h2>
      <Preview>
        <nav className="nova-breadcrumb" aria-label="Breadcrumb">
          <span className="nova-breadcrumb-item"><a href="#">Home</a></span>
          <span className="nova-breadcrumb-separator">/</span>
          <span className="nova-breadcrumb-item"><a href="#">Components</a></span>
          <span className="nova-breadcrumb-separator">/</span>
          <span className="nova-breadcrumb-current">Navigation</span>
        </nav>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Pagination</h2>
      <Preview>
        <nav className="nova-pagination" aria-label="Pagination">
          <button className="nova-pagination-item nova-pagination-disabled"><ArrowLeft size={16} /></button>
          <button className="nova-pagination-item nova-pagination-active">1</button>
          <button className="nova-pagination-item">2</button>
          <button className="nova-pagination-item">3</button>
          <button className="nova-pagination-item">...</button>
          <button className="nova-pagination-item">10</button>
          <button className="nova-pagination-item"><ArrowRight size={16} /></button>
        </nav>
      </Preview>

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<!-- Navbar -->
<nav class="nova-navbar">
  <span class="nova-navbar-brand">Brand</span>
  <div class="nova-navbar-nav">
    <a href="#" class="nova-navbar-link nova-navbar-link-active">Home</a>
    <a href="#" class="nova-navbar-link">About</a>
  </div>
</nav>

<!-- Breadcrumb -->
<nav class="nova-breadcrumb">
  <span class="nova-breadcrumb-item"><a href="#">Home</a></span>
  <span class="nova-breadcrumb-separator">/</span>
  <span class="nova-breadcrumb-current">Current</span>
</nav>

<!-- Pagination -->
<nav class="nova-pagination">
  <button class="nova-pagination-item">1</button>
  <button class="nova-pagination-item nova-pagination-active">2</button>
  <button class="nova-pagination-item">3</button>
</nav>`} />
    </div>
  );
}

// Utility pages
function LayoutPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Layout Utilities</h1>
      <p className="nova-text-muted nova-mb-8">Display, position, and layout utility classes.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Display</h2>
      <CodeBlock language="html" code={`<div class="nova-block">Block</div>
<div class="nova-inline-block">Inline Block</div>
<div class="nova-flex">Flex container</div>
<div class="nova-grid nova-grid-cols-3">Grid</div>
<div class="nova-hidden">Hidden element</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Position</h2>
      <CodeBlock language="html" code={`<div class="nova-relative">
  <div class="nova-absolute nova-top-0 nova-right-0">Absolute</div>
</div>
<div class="nova-fixed nova-top-0 nova-left-0">Fixed</div>
<div class="nova-sticky nova-top-0">Sticky</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Container</h2>
      <CodeBlock language="html" code={`<div class="nova-container">
  <!-- Auto-centered, responsive max-width -->
</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Overflow</h2>
      <CodeBlock language="html" code={`<div class="nova-overflow-hidden">Hidden overflow</div>
<div class="nova-overflow-auto">Auto scroll</div>
<div class="nova-overflow-x-auto">Horizontal scroll</div>`} />
    </div>
  );
}

function FlexboxGridPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Flexbox & Grid</h1>
      <p className="nova-text-muted nova-mb-8">Flexbox and CSS Grid utility classes.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Flexbox</h2>
      <Preview>
        <div className="nova-flex nova-flex-wrap nova-gap-3 nova-w-full">
          <div className="nova-flex-1 nova-p-4 nova-bg-surface nova-rounded-lg nova-text-center nova-text-sm">Flex 1</div>
          <div className="nova-flex-1 nova-p-4 nova-bg-surface nova-rounded-lg nova-text-center nova-text-sm">Flex 1</div>
          <div className="nova-flex-1 nova-p-4 nova-bg-surface nova-rounded-lg nova-text-center nova-text-sm">Flex 1</div>
        </div>
      </Preview>

      <CodeBlock language="html" code={`<div class="nova-flex nova-items-center nova-justify-between nova-gap-4">
  <div class="nova-flex-1">Item</div>
  <div class="nova-flex-none">Fixed</div>
</div>

<!-- Direction -->
<div class="nova-flex nova-flex-row">Row</div>
<div class="nova-flex nova-flex-col">Column</div>

<!-- Alignment -->
<div class="nova-flex nova-items-center">Center items</div>
<div class="nova-flex nova-justify-between">Space between</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Grid</h2>
      <Preview>
        <div className="nova-grid nova-grid-cols-3 nova-gap-3 nova-w-full">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="nova-p-4 nova-bg-surface nova-rounded-lg nova-text-center nova-text-sm">Cell {i}</div>
          ))}
        </div>
      </Preview>

      <CodeBlock language="html" code={`<div class="nova-grid nova-grid-cols-3 nova-gap-4">
  <div class="nova-col-span-2">Span 2</div>
  <div>Span 1</div>
  <div class="nova-col-span-full">Full width</div>
</div>`} />
    </div>
  );
}

function SpacingUtilsPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Spacing Utilities</h1>
      <p className="nova-text-muted nova-mb-8">Margin, padding, and gap utilities.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Padding</h2>
      <CodeBlock language="html" code={`<div class="nova-p-4">All sides</div>
<div class="nova-px-6 nova-py-4">Horizontal & vertical</div>
<div class="nova-pt-8">Top only</div>
<div class="nova-pb-4">Bottom only</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Margin</h2>
      <CodeBlock language="html" code={`<div class="nova-m-4">All sides</div>
<div class="nova-mx-auto">Centered</div>
<div class="nova-mt-4">Top only</div>
<div class="nova-mb-6">Bottom only</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Gap</h2>
      <CodeBlock language="html" code={`<div class="nova-flex nova-gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="nova-grid nova-grid-cols-3 nova-gap-6">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>`} />
    </div>
  );
}

function SizingPage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Sizing Utilities</h1>
      <p className="nova-text-muted nova-mb-8">Width, height, and max-width utilities.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Width</h2>
      <CodeBlock language="html" code={`<div class="nova-w-full">Full width</div>
<div class="nova-w-auto">Auto width</div>
<div class="nova-w-screen">Screen width</div>
<div class="nova-w-fit">Fit content</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Max Width</h2>
      <CodeBlock language="html" code={`<div class="nova-max-w-sm">Max 24rem</div>
<div class="nova-max-w-md">Max 28rem</div>
<div class="nova-max-w-lg">Max 32rem</div>
<div class="nova-max-w-xl">Max 36rem</div>
<div class="nova-max-w-4xl">Max 56rem</div>
<div class="nova-max-w-screen-lg">Max 1024px</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-3">Height</h2>
      <CodeBlock language="html" code={`<div class="nova-h-full">Full height</div>
<div class="nova-h-screen">Screen height</div>
<div class="nova-min-h-screen">Min screen height</div>`} />
    </div>
  );
}

function ResponsivePage() {
  return (
    <div>
      <h1 className="nova-text-3xl nova-font-bold nova-mb-2">Responsive Design</h1>
      <p className="nova-text-muted nova-mb-8">Mobile-first responsive utilities with breakpoints.</p>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-4">Breakpoints</h2>
      <div className="nova-border nova-rounded-lg nova-overflow-hidden nova-mb-6">
        <table className="nova-table nova-m-0">
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Min Width</th>
              <th>CSS</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="nova-font-mono nova-text-sm">sm</td><td>640px</td><td className="nova-font-mono nova-text-xs">@media (min-width: 640px)</td></tr>
            <tr><td className="nova-font-mono nova-text-sm">md</td><td>768px</td><td className="nova-font-mono nova-text-xs">@media (min-width: 768px)</td></tr>
            <tr><td className="nova-font-mono nova-text-sm">lg</td><td>1024px</td><td className="nova-font-mono nova-text-xs">@media (min-width: 1024px)</td></tr>
            <tr><td className="nova-font-mono nova-text-sm">xl</td><td>1280px</td><td className="nova-font-mono nova-text-xs">@media (min-width: 1280px)</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="nova-text-xl nova-font-semibold nova-mb-3">Usage</h2>
      <CodeBlock language="html" code={`<!-- Responsive display -->
<div class="nova-hidden md:nova-block">Hidden on mobile, visible on md+</div>

<!-- Responsive flex direction -->
<div class="nova-flex nova-flex-col md:nova-flex-row nova-gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive grid -->
<div class="nova-grid nova-grid-cols-1 md:nova-grid-cols-2 lg:nova-grid-cols-3 nova-gap-4">
  <div>Cell</div>
  <div>Cell</div>
  <div>Cell</div>
</div>

<!-- Responsive typography -->
<h1 class="nova-text-2xl md:nova-text-3xl lg:nova-text-4xl">Responsive heading</h1>

<!-- Responsive spacing -->
<div class="nova-p-4 md:nova-p-6 lg:nova-p-8">Responsive padding</div>`} />

      <h2 className="nova-text-xl nova-font-semibold nova-mt-8 nova-mb-4">Live Demo</h2>
      <p className="nova-text-sm nova-text-muted nova-mb-4">Resize your browser to see responsive behavior:</p>
      <div className="nova-grid nova-grid-cols-1 sm:nova-grid-cols-2 lg:nova-grid-cols-4 nova-gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="nova-p-4 nova-bg-surface nova-rounded-lg nova-text-center nova-text-sm">
            Column {i}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Layout
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { path } = useRouter();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="nova-min-h-screen" style={{ backgroundColor: 'var(--nova-color-background)' }}>
      {/* ===== MOBILE OFFCANVAS SIDEBAR ===== */}
      <div 
        className={`lg:nova-hidden ${sidebarOpen ? 'nova-fixed nova-inset-0' : 'nova-hidden'}`}
        style={{ zIndex: 50 }}
      >
        {/* Backdrop overlay */}
        <div 
          className="nova-absolute nova-inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeSidebar}
        />
        {/* Sidebar panel */}
        <div 
          className="nova-absolute nova-top-0 nova-left-0 nova-h-screen nova-overflow-y-auto"
          style={{ 
            width: 'min(16rem, 85vw)',
            backgroundColor: 'var(--nova-color-background)',
            borderRight: '1px solid var(--nova-color-border)',
            animation: 'nova-slide-right 0.2s ease-out'
          }}
        >
          <SidebarContent onClose={closeSidebar} showCloseButton />
        </div>
      </div>

      {/* ===== MOBILE LAYOUT (hidden on desktop) ===== */}
      <div className="lg:nova-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <div className="nova-p-4 md:nova-p-6 nova-max-w-4xl nova-mx-auto">
            <Routes currentPath={path}>
              <Route path="/" element={<HomePage />} currentPath={path} />
              <Route path="/installation" element={<InstallationPage />} currentPath={path} />
              <Route path="/quick-start" element={<QuickStartPage />} currentPath={path} />
              <Route path="/colors" element={<ColorsPage />} currentPath={path} />
              <Route path="/typography" element={<TypographyPage />} currentPath={path} />
              <Route path="/spacing" element={<SpacingPage />} currentPath={path} />
              <Route path="/shadows" element={<ShadowsPage />} currentPath={path} />
              <Route path="/utilities/layout" element={<LayoutPage />} currentPath={path} />
              <Route path="/utilities/flexbox-grid" element={<FlexboxGridPage />} currentPath={path} />
              <Route path="/utilities/spacing" element={<SpacingUtilsPage />} currentPath={path} />
              <Route path="/utilities/sizing" element={<SizingPage />} currentPath={path} />
              <Route path="/utilities/responsive" element={<ResponsivePage />} currentPath={path} />
              <Route path="/components/button" element={<ButtonPage />} currentPath={path} />
              <Route path="/components/input" element={<InputPage />} currentPath={path} />
              <Route path="/components/card" element={<CardPage />} currentPath={path} />
              <Route path="/components/badge" element={<BadgePage />} currentPath={path} />
              <Route path="/components/alert" element={<AlertPage />} currentPath={path} />
              <Route path="/components/table" element={<TablePage />} currentPath={path} />
              <Route path="/components/modal" element={<ModalPage />} currentPath={path} />
              <Route path="/components/tabs" element={<TabsPage />} currentPath={path} />
              <Route path="/components/navigation" element={<NavigationPage />} currentPath={path} />
              <Route path="/playground" element={<PlaygroundPage />} currentPath={path} />
              <Route path="/dark-mode" element={<DarkModePage />} currentPath={path} />
              <Route path="/theming" element={<ThemingPage />} currentPath={path} />
              <Route path="/border-beam" element={<BorderBeamPage />} currentPath={path} />
            </Routes>
          </div>
        </main>
      </div>

      {/* ===== DESKTOP LAYOUT (hidden on mobile, visible on lg+) ===== */}
      <div className="nova-hidden lg:nova-flex" style={{ minHeight: '100vh' }}>
        {/* Desktop sidebar - always visible, normal flow */}
        <div 
          className="nova-sticky nova-top-0 nova-h-screen"
          style={{ width: '16rem', flex: '0 0 16rem', borderRight: '1px solid var(--nova-color-border)', backgroundColor: 'var(--nova-color-background)' }}
        >
          <SidebarContent onClose={() => {}} />
        </div>

        {/* Main content area */}
        <main className="nova-flex-1 nova-min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} showMenu={false} />
          <div className="nova-p-6 md:nova-p-8 lg:nova-p-10 nova-max-w-4xl">
            <Routes currentPath={path}>
              <Route path="/" element={<HomePage />} currentPath={path} />
              <Route path="/installation" element={<InstallationPage />} currentPath={path} />
              <Route path="/quick-start" element={<QuickStartPage />} currentPath={path} />
              <Route path="/colors" element={<ColorsPage />} currentPath={path} />
              <Route path="/typography" element={<TypographyPage />} currentPath={path} />
              <Route path="/spacing" element={<SpacingPage />} currentPath={path} />
              <Route path="/shadows" element={<ShadowsPage />} currentPath={path} />
              <Route path="/utilities/layout" element={<LayoutPage />} currentPath={path} />
              <Route path="/utilities/flexbox-grid" element={<FlexboxGridPage />} currentPath={path} />
              <Route path="/utilities/spacing" element={<SpacingUtilsPage />} currentPath={path} />
              <Route path="/utilities/sizing" element={<SizingPage />} currentPath={path} />
              <Route path="/utilities/responsive" element={<ResponsivePage />} currentPath={path} />
              <Route path="/components/button" element={<ButtonPage />} currentPath={path} />
              <Route path="/components/input" element={<InputPage />} currentPath={path} />
              <Route path="/components/card" element={<CardPage />} currentPath={path} />
              <Route path="/components/badge" element={<BadgePage />} currentPath={path} />
              <Route path="/components/alert" element={<AlertPage />} currentPath={path} />
              <Route path="/components/table" element={<TablePage />} currentPath={path} />
              <Route path="/components/modal" element={<ModalPage />} currentPath={path} />
              <Route path="/components/tabs" element={<TabsPage />} currentPath={path} />
              <Route path="/components/navigation" element={<NavigationPage />} currentPath={path} />
              <Route path="/playground" element={<PlaygroundPage />} currentPath={path} />
              <Route path="/dark-mode" element={<DarkModePage />} currentPath={path} />
              <Route path="/theming" element={<ThemingPage />} currentPath={path} />
              <Route path="/border-beam" element={<BorderBeamPage />} currentPath={path} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// App
export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Layout />
      </RouterProvider>
    </ThemeProvider>
  );
}
