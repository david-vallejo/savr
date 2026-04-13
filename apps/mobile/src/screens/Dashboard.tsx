import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, PriceTag } from '@app/ui';
import { colors, spacing } from '@app/config';
import { useAuth } from '@app/auth';
import {
  useCart,
  useOrders,
  useWallet,
  usePrefs,
  formatUSD,
  MEALS,
  getMealById,
  effectivePriceCents,
  discountForLeadHours,
} from '@app/data';

export function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const cart = useCart();
  const orders = useOrders();
  const wallet = useWallet();
  const prefs = usePrefs();

  const upcoming = orders.find((o) => o.status === 'scheduled' || o.status === 'cooking');
  const featured = MEALS[0];
  const dealPrice = effectivePriceCents(featured, undefined, discountForLeadHours(24));
  const name = prefs.displayName || (user?.email ?? 'friend').split('@')[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={styles.h1}>Welcome back, {name}.</Text>
        <Text style={styles.sub}>Here's what's cooking.</Text>

        <Card tone="inverse" padded={false}>
          <View style={{ padding: spacing.lg }}>
            <Badge label="Today's deal · 20% off" tone="accent" size="md" />
            <Text style={styles.dealTitle}>{featured.name}</Text>
            <Text style={styles.dealBody}>{featured.tagline}</Text>
            <View style={styles.dealFoot}>
              <PriceTag cents={dealPrice} originalCents={featured.basePrice} size="lg" tone="accent" />
              <Button label="Lock it in" onPress={() => navigation.navigate('Menu', { screen: 'MealDetail', params: { id: featured.id } })} />
            </View>
          </View>
        </Card>

        <Card tone="accent">
          <Text style={styles.walletLabel}>Wallet</Text>
          <Text style={styles.walletBalance}>{formatUSD(wallet.balanceCents)}</Text>
          <Text style={styles.walletHint}>Top up $100 → get $115.</Text>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Top up"
              variant="secondary"
              onPress={() => navigation.navigate('You', { screen: 'Wallet' })}
              fullWidth
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Upcoming order</Text>
          {upcoming ? (
            <View style={{ marginTop: spacing.md }}>
              {upcoming.items.slice(0, 3).map((i) => {
                const meal = getMealById(i.mealId);
                return (
                  <View key={i.id} style={styles.orderItem}>
                    <Text style={{ fontSize: 24 }}>{meal?.imageEmoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700' }}>{meal?.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.textMuted }}>qty {i.qty}</Text>
                    </View>
                    <PriceTag cents={i.priceAtAdd * i.qty} />
                  </View>
                );
              })}
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
                Status: {upcoming.status} · Total {formatUSD(upcoming.totalCents)}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyMsg}>
              Nothing scheduled. Browse the menu to plan tomorrow.
            </Text>
          )}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>🛒 Cart</Text>
          <Text style={styles.sectionBody}>{cart.reduce((n, i) => n + i.qty, 0)} meals ready to order</Text>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label={cart.length ? 'Review cart' : 'Browse menu'}
              variant="outline"
              onPress={() => navigation.navigate(cart.length ? 'Cart' : 'Menu')}
              fullWidth
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>🤖 SavrBot</Text>
          <Text style={styles.sectionBody}>Need a plan? I'll design your week in seconds.</Text>
          <View style={{ marginTop: spacing.md }}>
            <Button label="Chat with SavrBot" onPress={() => navigation.navigate('SavrBot')} fullWidth />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  date: { fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text, letterSpacing: -0.8, marginTop: 2 },
  sub: { color: colors.textMuted, fontSize: 14, marginBottom: spacing.lg },
  dealTitle: { fontSize: 22, fontWeight: '900', color: colors.creamSoft, marginTop: spacing.sm, letterSpacing: -0.4 },
  dealBody: { color: '#C9BFA9', fontSize: 14, marginTop: 4 },
  dealFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  walletLabel: {
    fontSize: 11,
    color: colors.accentOn,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  walletBalance: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.accentOn,
    letterSpacing: -1,
    marginTop: 4,
  },
  walletHint: { fontSize: 13, color: colors.accentOn, opacity: 0.85 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  sectionBody: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  emptyMsg: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
