import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@app/auth';
import { Badge, Button, Card, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import {
  useCart,
  useOrders,
  useWallet,
  usePrefs,
  formatUSD,
  MEALS,
  getMealById,
  discountForLeadHours,
  effectivePriceCents,
} from '@app/data';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cart = useCart();
  const orders = useOrders();
  const wallet = useWallet();
  const prefs = usePrefs();

  const upcoming = orders.find((o) => o.status === 'scheduled' || o.status === 'cooking');
  const featured = MEALS[0];
  const dealPrice = effectivePriceCents(featured, undefined, discountForLeadHours(24));

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing['2xl'] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div>
            <div style={{ fontSize: 13, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginTop: 4 }}>
              Welcome back, {prefs.displayName || (user?.email ?? 'friend').split('@')[0]}.
            </h1>
            <p style={{ color: colors.textMuted, marginTop: 4 }}>
              Here's what's cooking. SavrBot is ready when you are.
            </p>
          </div>

          {/* Today's deal */}
          <Card tone="inverse" padded={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center' }}>
              <div style={{ padding: spacing.xl }}>
                <Badge label="Today's deal — 20% off" tone="accent" size="md" />
                <h2 style={{ fontFamily: fontFamilyWeb.display, fontSize: 30, fontWeight: 900, color: '#FBF7EE', marginTop: spacing.md, letterSpacing: -0.6 }}>
                  {featured.name}
                </h2>
                <p style={{ color: '#C9BFA9', marginTop: 6 }}>{featured.tagline}</p>
                <div style={{ marginTop: spacing.lg, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <PriceTag cents={dealPrice} originalCents={featured.basePrice} size="lg" tone="accent" />
                  <Button label="Lock it in" onPress={() => navigate(`/menu/${featured.id}`)} />
                </div>
              </div>
              <div style={{ fontSize: 200, textAlign: 'center', opacity: 0.9 }}>{featured.imageEmoji}</div>
            </div>
          </Card>

          {/* Upcoming */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Upcoming order</h3>
              <Button label="All orders" variant="ghost" onPress={() => navigate('/orders')} />
            </div>
            {upcoming ? (
              <div style={{ marginTop: spacing.md }}>
                {upcoming.items.slice(0, 3).map((i) => {
                  const meal = getMealById(i.mealId);
                  return (
                    <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ fontSize: 28 }}>{meal?.imageEmoji}</span>
                      <div style={{ flex: 1 }}>
                        <strong>{meal?.name}</strong>
                        <div style={{ fontSize: 12, color: colors.textMuted }}>qty {i.qty}</div>
                      </div>
                      <PriceTag cents={i.priceAtAdd * i.qty} />
                    </div>
                  );
                })}
                <div style={{ marginTop: 12, fontSize: 13, color: colors.textMuted }}>
                  Status: <strong>{upcoming.status}</strong> · Total {formatUSD(upcoming.totalCents)}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: spacing.md, color: colors.textMuted, fontSize: 14 }}>
                Nothing scheduled. Browse the menu to plan tomorrow.
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <Card tone="accent">
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.accentOn, textTransform: 'uppercase', letterSpacing: 1 }}>
              Wallet
            </div>
            <div style={{ fontFamily: fontFamilyWeb.display, fontSize: 40, fontWeight: 900, color: colors.accentOn, marginTop: 4 }}>
              {formatUSD(wallet.balanceCents)}
            </div>
            <div style={{ fontSize: 13, color: colors.accentOn, opacity: 0.8, marginBottom: 12 }}>
              Top up $100, get $115.
            </div>
            <Button
              label="Top up"
              variant="secondary"
              onPress={() => navigate('/wallet')}
              fullWidth
            />
          </Card>

          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>🛒 Cart</h3>
            <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              {cart.reduce((n, i) => n + i.qty, 0)} meals ready to order
            </div>
            <div style={{ marginTop: 12 }}>
              <Button
                label={cart.length ? 'Review cart' : 'Browse menu'}
                variant="outline"
                onPress={() => navigate(cart.length ? '/cart' : '/menu')}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>🤖 SavrBot</h3>
            <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Need a plan? I'll design your week in seconds.
            </p>
            <div style={{ marginTop: 12 }}>
              <Button label="Chat with SavrBot" onPress={() => navigate('/bot')} fullWidth />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
