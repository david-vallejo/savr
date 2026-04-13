import React from 'react';
import { colors, radius, spacing } from '@app/config';
import { EmptyStateProps } from './types';
import { Button } from './Button';

export function EmptyState({ icon, title, body, cta }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing['3xl'],
        borderRadius: radius.lg,
        border: `1px dashed ${colors.borderStrong}`,
        backgroundColor: colors.bgSoft,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{title}</div>
      {body ? (
        <div style={{ fontSize: 14, color: colors.textMuted, maxWidth: 360 }}>{body}</div>
      ) : null}
      {cta ? <Button label={cta.label} onPress={cta.onPress} /> : null}
    </div>
  );
}
