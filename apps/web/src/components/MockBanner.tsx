import React from 'react';
import { colors } from '@app/config';

export function MockBanner() {
  return (
    <div
      style={{
        padding: '6px 24px',
        backgroundColor: colors.warningBg,
        color: colors.warningText,
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: 0.2,
      }}
    >
      🧪 Mock mode — use <strong>user</strong> / <strong>password</strong> to log in. No Supabase calls are made.
    </div>
  );
}
