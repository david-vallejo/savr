import React from 'react';
import { useAuth } from '@app/auth';
import { Badge, Card, Chip, Input, Layout } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { usePrefs, updatePrefs } from '@app/data';

const PROTEINS = [
  { key: 'chicken', label: 'Chicken' },
  { key: 'steak', label: 'Steak' },
  { key: 'salmon', label: 'Salmon' },
  { key: 'carnitas', label: 'Carnitas' },
  { key: 'veggie', label: 'Veggie' },
  { key: 'tofu', label: 'Tofu' },
] as const;

const GOALS = [
  { key: 'convenience', label: '⏰ Convenience' },
  { key: 'family', label: '👨‍👩‍👧 Family' },
  { key: 'fitness', label: '💪 Fitness' },
  { key: 'budget', label: '💸 Budget' },
] as const;

const ALLERGIES = ['Gluten', 'Dairy', 'Shellfish', 'Peanuts', 'Soy', 'Egg'];

export function Profile() {
  const { user } = useAuth();
  const prefs = usePrefs();

  function toggleAllergy(a: string) {
    const next = prefs.allergies.includes(a)
      ? prefs.allergies.filter((x) => x !== a)
      : [...prefs.allergies, a];
    updatePrefs({ allergies: next });
  }

  return (
    <Layout>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginBottom: spacing.lg }}>
        Profile
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Account</h2>
          <div style={{ marginTop: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Input
              label="Display name"
              value={prefs.displayName}
              onChange={(v) => updatePrefs({ displayName: v })}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Email</div>
              <div style={{ fontSize: 15, color: colors.text, marginTop: 4 }}>{user?.email}</div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Favorite protein</h2>
          <div style={{ marginTop: spacing.md, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROTEINS.map((p) => (
              <Chip
                key={p.key}
                label={p.label}
                selected={prefs.proteinFavorite === p.key}
                onPress={() => updatePrefs({ proteinFavorite: prefs.proteinFavorite === p.key ? null : p.key })}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Your goal</h2>
          <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
            SavrBot uses this to personalize weekly plans.
          </p>
          <div style={{ marginTop: spacing.md, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GOALS.map((g) => (
              <Chip
                key={g.key}
                label={g.label}
                selected={prefs.goal === g.key}
                onPress={() => updatePrefs({ goal: prefs.goal === g.key ? null : g.key })}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Allergies</h2>
          <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
            We'll hide meals containing these ingredients.
          </p>
          <div style={{ marginTop: spacing.md, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALLERGIES.map((a) => (
              <Chip
                key={a}
                label={a}
                selected={prefs.allergies.includes(a)}
                onPress={() => toggleAllergy(a)}
              />
            ))}
          </div>
          {prefs.allergies.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Badge label={`${prefs.allergies.length} active`} tone="warn" />
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
