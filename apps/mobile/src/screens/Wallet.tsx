import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, PriceTag } from '@app/ui';
import { colors, spacing } from '@app/config';
import { useWallet, applyWalletTopUp, WALLET_TOPUPS, formatUSD } from '@app/data';

export function WalletScreen() {
  const wallet = useWallet();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Wallet</Text>

        <Card tone="inverse">
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>{formatUSD(wallet.balanceCents)}</Text>
          <Text style={styles.hint}>Wallet credit never expires.</Text>
        </Card>

        <Text style={styles.section}>Top up & earn bonus credit</Text>
        <View style={{ gap: spacing.md }}>
          {WALLET_TOPUPS.map((t) => (
            <Card key={t.payCents}>
              <Badge label={`+${t.bonusPct}% bonus`} tone="brand" />
              <View style={styles.topupRow}>
                <PriceTag cents={t.payCents} size="md" />
                <Text style={{ fontSize: 14, color: colors.textMuted }}>→</Text>
                <PriceTag cents={t.creditCents} size="md" tone="accent" />
              </View>
              <Button
                label={`Pay ${formatUSD(t.payCents)}`}
                fullWidth
                onPress={() => applyWalletTopUp(t.payCents, t.creditCents, t.bonusPct)}
              />
            </Card>
          ))}
        </View>

        <Text style={styles.section}>Recent top-ups</Text>
        {wallet.topUps.length === 0 ? (
          <Card>
            <Text style={{ textAlign: 'center', color: colors.textMuted }}>
              No top-ups yet. Try one above — mock mode, no real charges.
            </Text>
          </Card>
        ) : (
          wallet.topUps.map((t) => (
            <Card key={t.id}>
              <View style={styles.topupListRow}>
                <View>
                  <Text style={{ fontWeight: '800' }}>
                    {formatUSD(t.paidCents)} → {formatUSD(t.creditedCents)}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>
                    {new Date(t.at).toLocaleString()}
                  </Text>
                </View>
                <Badge label={`+${t.bonusPct}%`} tone="success" />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1, marginBottom: spacing.lg },
  balanceLabel: {
    fontSize: 11,
    color: '#C9BFA9',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  balance: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.creamSoft,
    letterSpacing: -1.5,
    marginTop: 2,
  },
  hint: { color: '#C9BFA9', fontSize: 13 },
  section: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  topupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  topupListRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
