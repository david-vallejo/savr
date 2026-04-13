import React from 'react';
import { useAuth } from '@app/auth';
import { Badge, Button, Card, Chip, Layout } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { usePrefs, updatePrefs } from '@app/data';

export function Settings() {
  const { user, logout, isMockMode } = useAuth();
  const prefs = usePrefs();

  return (
    <Layout>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginBottom: spacing.lg }}>
        Settings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, maxWidth: 640 }}>
        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Account</h2>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: colors.textMuted }}>Email</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.email}</div>
          </div>
          {isMockMode && (
            <div style={{ marginTop: 12 }}>
              <Badge label="Mock mode" tone="warn" />
              <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 8 }}>
                Connect Supabase to enable real user management. Add your keys to{' '}
                <code>apps/web/.env</code> and <code>apps/mobile/.env</code>.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Notifications</h2>
          <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
            Get pinged when deals match your prefs.
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <Chip
              label="Deals & reminders"
              selected={prefs.notifyDeals}
              onPress={() => updatePrefs({ notifyDeals: !prefs.notifyDeals })}
            />
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Session</h2>
          <div style={{ marginTop: 12 }}>
            <Button label="Log out" variant="outline" onPress={logout} />
          </div>
        </Card>
      </div>
    </Layout>
  );
}
