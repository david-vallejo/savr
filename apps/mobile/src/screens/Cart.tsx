import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, Chip, EmptyState, Input, PriceTag } from '@app/ui';
import { colors, spacing } from '@app/config';
import {
  useCart,
  useFulfillment,
  setFulfillment,
  updateCartQty,
  removeCartItem,
  placeOrder,
  getMealById,
  formatUSD,
  formatISOForDisplay,
  cartSubtotalCents,
  cartDiscountCents,
  MEALS,
} from '@app/data';

export function CartScreen({ navigation }: any) {
  const cart = useCart();
  const fulfillment = useFulfillment();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={styles.h1}>Your cart</Text>
          <View style={{ marginTop: spacing.xl }}>
            <EmptyState
              icon="🛒"
              title="No meals in your cart"
              body="Browse today's menu and pre-order to lock in discounts."
              cta={{ label: 'Open menu', onPress: () => navigation.navigate('Menu') }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const subtotal = cartSubtotalCents(cart);
  const savings = cartDiscountCents(cart, MEALS);
  const undiscounted = subtotal + savings;

  function handleCheckout() {
    const order = placeOrder();
    if (order) navigation.navigate('Orders');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Your cart</Text>

        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {cart.map((item) => {
            const meal = getMealById(item.mealId);
            if (!meal) return null;
            return (
              <Card key={item.id} padded={false}>
                <View style={styles.itemRow}>
                  <View style={[styles.thumb, { backgroundColor: meal.accentColor }]}>
                    <Text style={{ fontSize: 40 }}>{meal.imageEmoji}</Text>
                  </View>
                  <View style={{ flex: 1, padding: spacing.md }}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemName}>{meal.name}</Text>
                      {item.discountPct > 0 && <Badge label={`−${item.discountPct}%`} tone="brand" />}
                    </View>
                    <Text style={styles.itemWhen}>{formatISOForDisplay(item.scheduledFor)}</Text>
                    {item.customization && (
                      <Text style={styles.itemCustom}>
                        {item.customization.protein} · {item.customization.base}
                        {item.customization.addGuac ? ' · guac' : ''}
                      </Text>
                    )}
                    <View style={styles.itemFoot}>
                      <View style={styles.qtyRow}>
                        <QtyBtn label="−" onPress={() => updateCartQty(item.id, item.qty - 1)} />
                        <Text style={{ fontSize: 14, fontWeight: '800', minWidth: 22, textAlign: 'center' }}>
                          {item.qty}
                        </Text>
                        <QtyBtn label="+" onPress={() => updateCartQty(item.id, item.qty + 1)} />
                      </View>
                      <PriceTag cents={item.priceAtAdd * item.qty} />
                    </View>
                    <Pressable onPress={() => removeCartItem(item.id)}>
                      <Text style={styles.remove}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Checkout panel */}
        <Card>
          <Text style={styles.section}>Checkout</Text>
          <Label>Fulfillment</Label>
          <View style={styles.row}>
            <Chip
              label="Pickup"
              selected={fulfillment.fulfillment === 'pickup'}
              onPress={() => setFulfillment('pickup')}
            />
            <Chip
              label="Delivery"
              selected={fulfillment.fulfillment === 'delivery'}
              onPress={() => setFulfillment('delivery')}
            />
          </View>
          <View style={{ marginTop: spacing.md }}>
            {fulfillment.fulfillment === 'pickup' ? (
              <Input
                label="Pickup spot"
                value={fulfillment.pickupSpot}
                onChange={(v) => setFulfillment('pickup', { pickupSpot: v })}
              />
            ) : (
              <Input
                label="Delivery address"
                value={fulfillment.address}
                onChange={(v) => setFulfillment('delivery', { address: v })}
                placeholder="Street, City"
              />
            )}
          </View>

          <View style={styles.totals}>
            <RowLine label="Subtotal" value={formatUSD(undiscounted)} />
            {savings > 0 && <RowLine label="Pre-order savings" value={`−${formatUSD(savings)}`} tone="accent" />}
            <RowLine label="Fees" value={formatUSD(0)} />
            <View style={styles.totalRow}>
              <Text style={{ fontWeight: '800' }}>Total</Text>
              <PriceTag cents={subtotal} size="lg" tone="accent" />
            </View>
          </View>

          <Button label="Place order" fullWidth size="lg" onPress={handleCheckout} />
          <Text style={styles.footNote}>Mock mode — no real charges.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.textMuted,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
      }}
    >
      {children}
    </Text>
  );
}

function RowLine({ label, value, tone }: { label: string; value: string; tone?: 'accent' }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
      <Text style={{ fontSize: 14, color: tone === 'accent' ? colors.brand : colors.text }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: tone === 'accent' ? colors.brand : colors.text }}>
        {value}
      </Text>
    </View>
  );
}

function QtyBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  itemRow: { flexDirection: 'row' },
  thumb: { width: 100, alignItems: 'center', justifyContent: 'center' },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  itemName: { fontSize: 15, fontWeight: '800', color: colors.text, flex: 1 },
  itemWhen: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  itemCustom: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  itemFoot: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  remove: { fontSize: 12, color: colors.brand, fontWeight: '700', marginTop: 6 },
  section: { fontSize: 20, fontWeight: '900', color: colors.text },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  totals: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  footNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});
