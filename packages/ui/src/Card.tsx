import React from 'react';
import { colors, radius, shadowsWeb, spacing } from '@app/config';
import { CardProps } from './types';

export function Card({
  children,
  onPress,
  padded = true,
  tone = 'default',
  style,
}: CardProps) {
  const bg =
    tone === 'inverse' ? colors.bgInverse : tone === 'accent' ? colors.accent : colors.bgPaper;
  const border = tone === 'inverse' ? colors.borderDark : colors.border;

  const baseStyle: React.CSSProperties = {
    backgroundColor: bg,
    border: `1px solid ${border}`,
    borderRadius: radius.lg,
    padding: padded ? spacing.xl : 0,
    boxShadow: shadowsWeb.sm,
    cursor: onPress ? 'pointer' : 'default',
    transition: 'transform 160ms ease, box-shadow 200ms ease',
    color: tone === 'inverse' ? colors.textOnDark : colors.text,
    overflow: 'hidden',
    ...(style as React.CSSProperties),
  };

  if (onPress) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onPress}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPress()}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadowsWeb.lg;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadowsWeb.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        style={baseStyle}
      >
        {children}
      </div>
    );
  }
  return <div style={baseStyle}>{children}</div>;
}
