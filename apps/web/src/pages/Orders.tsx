import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, EmptyState, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { useOrders, cancelOrder, getMealById, formatISOForDisplay } from '@app/data';
import type { Order } from '@app/data';

const STATUS_TONE: Record<Order['status'], 'brand' | 'success' | 'warn' | 'neutral'> = {
  scheduled: 'brand',
  cooking: 'warn',
  ready: 'success',
  completed: 'success',
  cancelled: 'neutral',
};

export function Orders() {
  const orders = useOrders();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <Layout>
        <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, marginBottom: spacing.xl }}>
          Orders
        </h1>
        <EmptyState
          icon="📦"
          title="No orders yet"
          body="Place your first pre-order and track it here."
          cta={{ label: 'Open menu', onPress: () => navigate('/menu') }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginBottom: spacing.lg }}>
        Orders
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {orders.map((o) => (
          <Card key={o.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <strong style={{ fontSize: 16 }}>Order #{o.id.slice(-5)}</strong>
                  <Badge label={o.status} tone={STATUS_TONE[o.status]} />
                </div>
                <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                  For {formatISOForDisplay(o.scheduledFor)} · {o.fulfillment}
                </div>
              </div>
              <PriceTag cents={o.totalCents} size="md" tone="accent" />
            </div>
            <div
              style={{
                marginTop: spacing.md,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 10,
              }}
            >
              {o.items.map((i) => {
                const meal = getMealById(i.mealId);
                return (
                  <div
                    key={i.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: colors.bgSoft,
                    }}
                  >
                    <span style={{ fontSize: 30 }}>{meal?.imageEmoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{meal?.name}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>qty {i.qty}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {o.status === 'scheduled' && (
              <div style={{ marginTop: spacing.md }}>
                <Button label="Cancel order" variant="outline" onPress={() => cancelOrder(o.id)} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </Layout>
  );
}
