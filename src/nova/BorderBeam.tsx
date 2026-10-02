/**
 * NOVA CSS - Border Beam React Components
 * Animated gradient border beam inspired by Magic UI
 *
 * Uses conic-gradient + @property for smooth rotation
 * and ambient glow effect via ::after with blur.
 */

import { type ReactNode } from 'react';

export type BorderBeamSize = 'sm' | 'md' | 'lg';
export type BorderBeamSpeed = 'slow' | 'normal' | 'fast';
export type BorderBeamColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'rainbow';

export interface BorderBeamProps {
  children: ReactNode;
  size?: BorderBeamSize;
  speed?: BorderBeamSpeed;
  color?: BorderBeamColor;
  className?: string;
  style?: React.CSSProperties;
  /** When true, wraps children in .nova-border-beam__content automatically */
  withContent?: boolean;
}

/**
 * Animated gradient border beam.
 *
 * @example
 * <BorderBeam color="primary" size="md">
 *   <div className="nova-p-6">Your content</div>
 * </BorderBeam>
 */
export function BorderBeam({
  children,
  size = 'md',
  speed = 'normal',
  color = 'primary',
  className = '',
  style,
  withContent = true,
}: BorderBeamProps) {
  const classes = [
    'nova-border-beam',
    `nova-border-beam--${size}`,
    speed !== 'normal' && `nova-border-beam--${speed}`,
    `nova-border-beam--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {withContent ? (
        <div className="nova-border-beam__content">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Border Beam Card — pre-styled card with animated border.
 */
export function BorderBeamCard({
  children,
  className = '',
  ...props
}: Omit<BorderBeamProps, 'withContent'>) {
  return (
    <BorderBeam className={`nova-card ${className}`} {...props}>
      <div className="nova-card-body">{children}</div>
    </BorderBeam>
  );
}

/**
 * Border Beam Button — button wrapped with animated border.
 */
export function BorderBeamButton({
  children,
  className = '',
  ...props
}: Omit<BorderBeamProps, 'withContent'>) {
  return (
    <BorderBeam className={`nova-inline-block ${className}`} {...props}>
      <button className="nova-btn nova-btn-primary">{children}</button>
    </BorderBeam>
  );
}

/**
 * Border Beam Badge — small badge with animated border.
 */
export function BorderBeamBadge({
  children,
  className = '',
  size = 'sm',
  ...props
}: Omit<BorderBeamProps, 'withContent'> & { size?: BorderBeamSize }) {
  return (
    <BorderBeam
      className={`nova-inline-block ${className}`}
      size={size}
      {...props}
    >
      <span className="nova-badge">{children}</span>
    </BorderBeam>
  );
}
