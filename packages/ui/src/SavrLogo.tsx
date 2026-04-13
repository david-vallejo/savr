import React from 'react';
import { colors, fontFamilyWeb } from '@app/config';
import { LogoProps } from './types';

export function SavrLogo({ size = 24, tone = 'dark' }: LogoProps) {
  const fg = tone === 'light' ? colors.creamSoft ?? '#FBF7EE' : colors.text;
  const accent = colors.brand;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: fontFamilyWeb.display,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: -0.8,
        color: fg,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size * 1.2,
          height: size * 1.2,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${accent} 0%, ${colors.accent} 100%)`,
          color: '#FFF',
          fontSize: size * 0.62,
          fontWeight: 900,
          boxShadow: '0 6px 16px rgba(200, 16, 46, 0.35)',
        }}
      >
        S
      </span>
      savr
    </span>
  );
}
