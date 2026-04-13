import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@app/auth';
import { Badge, Card, Chip, Input } from '@app/ui';
import { colors, spacing } from '@app/config';
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

export function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const prefs = usePrefs();

  function toggleAllergy(a: string) {
    const next = prefs.allergies.includes(a)
      ? prefs.allergies.filter((x) => x !== a)
      : [...prefs.allergies, a];
    updatePrefs({ allergies: next });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Profile</Text>

        <Card>
          <Text style={styles.h2}>Account</Text>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            <Input
              label="Display name"
              value={prefs.displayName}
              onChange={(v) => updatePrefs({ displayName: v })}
            />
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.h2}>Favorite protein</Text>
          <View style={styles.chipRow}>
            {PROTEINS.map((p) => (
              <Chip
                key={p.key}
                label={p.label}
                selected={prefs.proteinFavorite === p.key}
                onPress={() => updatePrefs({ proteinFavorite: prefs.proteinFavorite === p.key ? null : p.key })}
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.h2}>Your goal</Text>
          <Text style={styles.note}>SavrBot uses this to personalize plans.</Text>
          <View style={styles.chipRow}>
            {GOALS.map((g) => (
              <Chip
                key={g.key}
                label={g.label}
                selected={prefs.goal === g.key}
                onPress={() => updatePrefs({ goal: prefs.goal === g.key ? null : g.key })}
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.h2}>Allergies</Text>
          <Text style={styles.note}>We hide meals containing these.</Text>
          <View style={styles.chipRow}>
            {ALLERGIES.map((a) => (
              <Chip
                key={a}
                label={a}
                selected={prefs.allergies.includes(a)}
                onPress={() => toggleAllergy(a)}
              />
            ))}
          </View>
          {prefs.allergies.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <Badge label={`${prefs.allergies.length} active`} tone="warn" />
            </View>
          )}
        </Card>

        <Card>
          <Pressable onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.navLink}>💰 Wallet</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.navLink}>📅 Plans</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.navLink}>⚙️ Settings</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1, marginBottom: spacing.lg },
  h2: { fontSize: 16, fontWeight: '800', color: colors.text },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  label: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 15, color: colors.text, marginTop: 2 },
  navLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
