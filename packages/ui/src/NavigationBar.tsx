import React from 'react';
import { colors, fontFamilyWeb, radius, spacing } from '@app/config';
import { NavigationBarProps } from './types';

export function NavigationBar({ items }: NavigationBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: spacing.xs,
        padding: `${spacing.sm}px ${spacing.xl}px`,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.bgSoft,
        overflowX: 'auto',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onPress}
          style={{
            padding: `${spacing.sm}px ${spacing.lg}px`,
            borderRadius: radius.pill,
            border: 'none',
            background: item.active ? colors.bgInverse : 'transparent',
            color: item.active ? colors.textOnDark : colors.text,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: item.active ? 700 : 500,
            fontFamily: fontFamilyWeb.sans,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {item.label}
          {item.badge != null && item.badge !== '' ? (
            <span
              style={{
                backgroundColor: item.active ? colors.brand : colors.brand,
                color: colors.brandOn,
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: radius.pill,
              }}
            >
              {item.badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
}
