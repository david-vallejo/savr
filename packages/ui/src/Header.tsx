import React from 'react';
import { colors, fontFamilyWeb, radius, spacing, typeScale } from '@app/config';
import { HeaderProps } from './types';

export function Header({ title, subtitle, rightAction, leftAction, transparent }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.lg}px ${spacing.xl}px`,
        borderBottom: transparent ? 'none' : `1px solid ${colors.border}`,
        backgroundColor: transparent ? 'transparent' : colors.bgPaper,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'saturate(180%) blur(8px)',
        WebkitBackdropFilter: 'saturate(180%) blur(8px)',
      }}
    >
      {leftAction ? (
        <button
          onClick={leftAction.onPress}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: fontFamilyWeb.sans,
            padding: `${spacing.sm}px ${spacing.md}px`,
            borderRadius: radius.pill,
          }}
        >
          {leftAction.label}
        </button>
      ) : (
        <div />
      )}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: fontFamilyWeb.display,
            fontSize: typeScale.h3,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{subtitle}</div>
        ) : null}
      </div>
      {rightAction ? (
        <button
          onClick={rightAction.onPress}
          style={{
            background: 'none',
            border: `1px solid ${colors.border}`,
            color: colors.text,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: fontFamilyWeb.sans,
            padding: `${spacing.sm}px ${spacing.lg}px`,
            borderRadius: radius.pill,
          }}
        >
          {rightAction.label}
        </button>
      ) : (
        <div />
      )}
    </header>
  );
}
