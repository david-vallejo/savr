import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, EmptyState, PriceTag } from '@app/ui';
import { colors, spacing } from '@app/config';
import { useOrders, cancelOrder, getMealById, formatISOForDisplay } from '@app/data';
import type { Order } from '@app/data';

const STATUS_TONE: Record<Order['status'], 'brand' | 'success' | 'warn' | 'neutral'> = {
  scheduled: 'brand',
  cooking: 'warn',
  ready: 'success',
  completed: 'success',
  cancelled: 'neutral',
};

export function OrdersScreen({ navigation }: any) {
  const orders = useOrders();

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={styles.h1}>Orders</Text>
          <View style={{ marginTop: spacing.xl }}>
            <EmptyState
              icon="📦"
              title="No orders yet"
              body="Place your first pre-order and track it here."
              cta={{ label: 'Open menu', onPress: () => navigation.navigate('Menu') }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Orders</Text>
        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {orders.map((o) => (
            <Card key={o.id}>
              <View style={styles.headRow}>
                <View>
                  <Text style={{ fontWeight: '800', fontSize: 15 }}>Order #{o.id.slice(-5)}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                    For {formatISOForDisplay(o.scheduledFor)} · {o.fulfillment}
                  </Text>
                </View>
                <Badge label={o.status} tone={STATUS_TONE[o.status]} />
              </View>
              <View style={{ marginTop: spacing.md, gap: 6 }}>
                {o.items.map((i) => {
                  const meal = getMealById(i.mealId);
                  return (
                    <View key={i.id} style={styles.lineItem}>
                      <Text style={{ fontSize: 26 }}>{meal?.imageEmoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700' }}>{meal?.name}</Text>
                        <Text style={{ fontSize: 11, color: colors.textMuted }}>qty {i.qty}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>Total</Text>
                <PriceTag cents={o.totalCents} size="md" tone="accent" />
              </View>
              {o.status === 'scheduled' && (
                <View style={{ marginTop: spacing.md }}>
                  <Button label="Cancel order" variant="outline" onPress={() => cancelOrder(o.id)} />
                </View>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSoft,
    padding: 10,
    borderRadius: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
