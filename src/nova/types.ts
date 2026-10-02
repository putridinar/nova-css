/**
 * NOVA CSS - TypeScript Type Definitions
 * 
 * Type-safe APIs for NOVA CSS components and utilities.
 */

// ---- Theme Types ----

export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type SemanticColor = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info';

export type ColorToken = 
  | `--nova-color-${SemanticColor}`
  | `--nova-color-background`
  | `--nova-color-surface`
  | `--nova-color-text`
  | `--nova-color-muted`
  | `--nova-color-border`;

export type PrimitiveColorToken = 
  | `--nova-primary-${ColorScale}`
  | `--nova-secondary-${ColorScale}`
  | `--nova-success-${ColorScale}`
  | `--nova-warning-${ColorScale}`
  | `--nova-danger-${ColorScale}`
  | `--nova-info-${ColorScale}`
  | `--nova-neutral-${ColorScale}`;

// ---- Spacing Types ----

export type SpacingScale = 
  | '0' | 'px' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' 
  | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' 
  | '24' | '32' | '40' | '48' | '64';

export type SpacingToken = `--nova-space-${SpacingScale}`;

// ---- Typography Types ----

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type FontFamily = 'sans' | 'mono' | 'serif';

// ---- Component Types ----

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export type AlertVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps {
  size?: InputSize;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  initials?: string;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

// ---- Configuration Types ----

export interface NovaConfig {
  theme: {
    colors?: Partial<Record<SemanticColor, Partial<Record<ColorScale, string>>>>;
    spacing?: Partial<Record<SpacingScale, string>>;
    typography?: {
      fontFamily?: Partial<Record<FontFamily, string | string[]>>;
      fontSize?: Partial<Record<FontSize, string>>;
    };
    borderRadius?: Partial<Record<string, string>>;
  };
  content?: string[];
}

// ---- Utility Class Types ----

export type DisplayUtility = 
  | 'nova-block' | 'nova-inline-block' | 'nova-inline' 
  | 'nova-flex' | 'nova-inline-flex' | 'nova-grid' 
  | 'nova-inline-grid' | 'nova-hidden' | 'nova-table';

export type FlexDirection = 'nova-flex-row' | 'nova-flex-col' | 'nova-flex-row-reverse' | 'nova-flex-col-reverse';
export type AlignItems = 'nova-items-start' | 'nova-items-end' | 'nova-items-center' | 'nova-items-baseline' | 'nova-items-stretch';
export type JustifyContent = 'nova-justify-start' | 'nova-justify-end' | 'nova-justify-center' | 'nova-justify-between' | 'nova-justify-around' | 'nova-justify-evenly';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ResponsiveClass<T extends string> = T | `sm\\:${T}` | `md\\:${T}` | `lg\\:${T}` | `xl\\:${T}`;

// ---- Theme Helper ----

export function setTheme(theme: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export function getTheme(): ThemeMode {
  return (document.documentElement.getAttribute('data-theme') as ThemeMode) || 'light';
}

export function toggleTheme(): void {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
}

// ---- Class Name Helper ----

export function nova(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
