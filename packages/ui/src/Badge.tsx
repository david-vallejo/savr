import React from 'react';
import { colors, radius } from '@app/config';
import { BadgeProps, BadgeTone } from './types';

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  brand: { bg: colors.brand, fg: colors.brandOn },
  accent: { bg: colors.accent, fg: colors.accentOn },
  success: { bg: '#E4F2E1', fg: colors.secondaryDark },
  warn: { bg: colors.warningBg, fg: colors.warningText },
  neutral: { bg: colors.bgSoft, fg: colors.text },
  inverse: { bg: colors.bgInverse, fg: colors.textOnDark },
};

export function Badge({ label, tone = 'neutral', size = 'sm' }: BadgeProps) {
  const { bg, fg } = tones[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: bg,
        color: fg,
        fontSize: size === 'md' ? 12 : 11,
        fontWeight: 700,
        padding: size === 'md' ? '5px 10px' : '3px 8px',
        borderRadius: radius.pill,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}
