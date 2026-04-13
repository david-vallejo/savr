import React from 'react';
import { colors, radius } from '@app/config';
import { ChipProps } from './types';

export function Chip({ label, selected, onPress, leadingIcon }: ChipProps) {
  return (
    <button
      onClick={onPress}
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: radius.pill,
        border: `1.5px solid ${selected ? colors.brand : colors.borderStrong}`,
        background: selected ? colors.brand : 'transparent',
        color: selected ? colors.brandOn : colors.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 180ms ease',
        fontFamily: 'inherit',
      }}
    >
      {leadingIcon ? <span>{leadingIcon}</span> : null}
      {label}
    </button>
  );
}
