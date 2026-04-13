import React from 'react';
import { colors, radius, spacing, shadowsWeb, fontFamilyWeb } from '@app/config';
import { ButtonProps } from './types';

const sizes: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: `${spacing.sm}px ${spacing.md}px`, fontSize: 13 },
  md: { padding: `${spacing.md}px ${spacing.xl}px`, fontSize: 15 },
  lg: { padding: `${spacing.lg}px ${spacing['2xl']}px`, fontSize: 17 },
};

const variants: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.brand,
    color: colors.brandOn,
    boxShadow: shadowsWeb.glow,
    border: '1px solid transparent',
  },
  secondary: {
    backgroundColor: colors.bgInverse,
    color: colors.textOnDark,
    border: '1px solid transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.text,
    border: `1.5px solid ${colors.borderStrong}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text,
    border: '1px solid transparent',
  },
  accent: {
    backgroundColor: colors.accent,
    color: colors.accentOn,
    border: '1px solid transparent',
  },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leadingIcon,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: radius.pill,
        fontFamily: fontFamilyWeb.sans,
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 120ms ease, filter 160ms ease, box-shadow 200ms ease',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.55 : 1,
        ...sizes[size],
        ...variants[variant],
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {leadingIcon ? <span style={{ fontSize: '1.1em' }}>{leadingIcon}</span> : null}
      {label}
    </button>
  );
}
