import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Chip, EmptyState, Input, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
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
import { useAuth } from '@app/auth';

export function Cart() {
  const cart = useCart();
  const fulfillment = useFulfillment();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Layout>
        <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, marginBottom: spacing.xl }}>
          Your cart
        </h1>
        <EmptyState
          icon="🛒"
          title="No meals in your cart yet"
          body="Browse today's menu and pre-order to lock in discounts."
          cta={{ label: 'Open menu', onPress: () => navigate('/menu') }}
        />
      </Layout>
    );
  }

  const subtotal = cartSubtotalCents(cart);
  const savings = cartDiscountCents(cart, MEALS);
  const undiscounted = subtotal + savings;
  const total = subtotal;

  function handleCheckout() {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    const order = placeOrder();
    if (order) navigate('/orders');
  }

  return (
    <Layout>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginBottom: spacing.lg }}>
        Your cart
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: spacing['2xl'] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {cart.map((item) => {
            const meal = getMealById(item.mealId);
            if (!meal) return null;
            return (
              <Card key={item.id} padded={false}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0,1fr) auto', gap: spacing.lg, padding: spacing.lg, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${meal.accentColor}, ${colors.charcoalSoft ?? '#2A2320'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 50,
                    }}
                  >
                    {meal.imageEmoji}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ fontSize: 16 }}>{meal.name}</strong>
                      {item.discountPct > 0 ? <Badge label={`−${item.discountPct}%`} tone="brand" /> : null}
                    </div>
                    <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                      {formatISOForDisplay(item.scheduledFor)}
                    </div>
                    {item.customization ? (
                      <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                        {item.customization.protein} · {item.customization.base}
                        {item.customization.addGuac ? ' · guac' : ''}
                        {item.customization.doubleProtein ? ' · 2× protein' : ''}
                      </div>
                    ) : null}
                    <button
                      onClick={() => removeCartItem(item.id)}
                      style={{ marginTop: 8, background: 'none', border: 'none', color: colors.brand, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <PriceTag cents={item.priceAtAdd * item.qty} />
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <QtyBtn label="−" onPress={() => updateCartQty(item.id, item.qty - 1)} />
                      <strong style={{ minWidth: 22, textAlign: 'center' }}>{item.qty}</strong>
                      <QtyBtn label="+" onPress={() => updateCartQty(item.id, item.qty + 1)} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Checkout panel */}
        <Card>
          <h2 style={{ fontFamily: fontFamilyWeb.display, fontSize: 22, fontWeight: 800 }}>Checkout</h2>

          <section style={{ marginTop: spacing.lg }}>
            <Label>Fulfillment</Label>
            <div style={{ display: 'flex', gap: 8 }}>
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
            </div>
            <div style={{ marginTop: 10 }}>
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
            </div>
          </section>

          <section style={{ marginTop: spacing.lg, borderTop: `1px solid ${colors.border}`, paddingTop: spacing.lg, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Row label="Subtotal" value={formatUSD(undiscounted)} />
            {savings > 0 ? (
              <Row label="Pre-order savings" value={`−${formatUSD(savings)}`} tone="accent" />
            ) : null}
            <Row label="Fees" value={formatUSD(0)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
              <strong>Total</strong>
              <PriceTag cents={total} size="lg" tone="accent" />
            </div>
          </section>

          <div style={{ marginTop: spacing.lg }}>
            <Button
              label={user ? 'Place order' : 'Sign in & place order'}
              size="lg"
              fullWidth
              onPress={handleCheckout}
            />
            <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8, textAlign: 'center' }}>
              Mock mode — no real charges.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'accent' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: tone === 'accent' ? colors.brand : colors.text }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: colors.textMuted, marginBottom: 8 }}>
      {children}
    </h3>
  );
}

function QtyBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        border: `1.5px solid ${colors.borderStrong}`,
        background: colors.bgPaper,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 800,
      }}
    >
      {label}
    </button>
  );
}
