import React from 'react';
import { colors, fontFamilyWeb } from '@app/config';
import { PriceTagProps } from './types';

const sizeMap = { sm: 14, md: 18, lg: 28 };

function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function PriceTag({ cents, originalCents, size = 'md', tone = 'default' }: PriceTagProps) {
  const hasDiscount = originalCents != null && originalCents > cents;
  const color = tone === 'accent' ? colors.brand : colors.text;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, fontFamily: fontFamilyWeb.display }}>
      <span style={{ fontSize: sizeMap[size], fontWeight: 800, color, letterSpacing: -0.3 }}>
        {formatUSD(cents)}
      </span>
      {hasDiscount ? (
        <span
          style={{
            fontSize: Math.round(sizeMap[size] * 0.7),
            color: colors.textMuted,
            textDecoration: 'line-through',
          }}
        >
          {formatUSD(originalCents!)}
        </span>
      ) : null}
    </span>
  );
}
