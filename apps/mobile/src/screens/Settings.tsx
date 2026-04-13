import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@app/auth';
import { Badge, Button, Card, Chip } from '@app/ui';
import { colors, spacing } from '@app/config';
import { usePrefs, updatePrefs } from '@app/data';

export function SettingsScreen() {
  const { user, logout, isMockMode } = useAuth();
  const prefs = usePrefs();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Settings</Text>

        <Card>
          <Text style={styles.h2}>Account</Text>
          <View style={{ marginTop: spacing.md }}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          {isMockMode && (
            <View style={{ marginTop: spacing.md }}>
              <Badge label="Mock mode" tone="warn" />
              <Text style={styles.note}>
                Connect Supabase to enable real user management. Add keys to apps/mobile/.env.
              </Text>
            </View>
          )}
        </Card>

        <Card>
          <Text style={styles.h2}>Notifications</Text>
          <Text style={styles.note}>Get pinged when deals match your prefs.</Text>
          <View style={{ marginTop: spacing.md }}>
            <Chip
              label="Deals & reminders"
              selected={prefs.notifyDeals}
              onPress={() => updatePrefs({ notifyDeals: !prefs.notifyDeals })}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.h2}>Session</Text>
          <View style={{ marginTop: spacing.md }}>
            <Button label="Log out" variant="outline" onPress={logout} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1, marginBottom: spacing.lg },
  h2: { fontSize: 16, fontWeight: '800', color: colors.text },
  label: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 15, color: colors.text, marginTop: 2, fontWeight: '600' },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
});
