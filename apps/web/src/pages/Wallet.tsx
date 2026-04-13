import React from 'react';
import { Badge, Button, Card, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { useWallet, applyWalletTopUp, WALLET_TOPUPS, formatUSD } from '@app/data';

export function Wallet() {
  const wallet = useWallet();

  return (
    <Layout>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1, marginBottom: spacing.lg }}>
        Wallet
      </h1>
      <Card tone="inverse">
        <div style={{ fontSize: 13, color: '#C9BFA9', textTransform: 'uppercase', letterSpacing: 1 }}>
          Balance
        </div>
        <div
          style={{
            fontFamily: fontFamilyWeb.display,
            fontSize: 64,
            fontWeight: 900,
            color: '#FBF7EE',
            letterSpacing: -2,
            marginTop: 4,
          }}
        >
          {formatUSD(wallet.balanceCents)}
        </div>
        <div style={{ color: '#C9BFA9', fontSize: 14 }}>
          Wallet credit never expires. Use it on any meal, plan, or upgrade.
        </div>
      </Card>

      <h2 style={{ fontFamily: fontFamilyWeb.display, fontSize: 24, fontWeight: 900, marginTop: spacing['2xl'], marginBottom: spacing.md }}>
        Top up & earn bonus credit
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: spacing.md,
        }}
      >
        {WALLET_TOPUPS.map((t) => (
          <Card key={t.payCents}>
            <Badge label={`+${t.bonusPct}% bonus`} tone="brand" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.md }}>
              <PriceTag cents={t.payCents} size="lg" />
              <span style={{ fontSize: 13, color: colors.textMuted }}>→</span>
              <PriceTag cents={t.creditCents} size="lg" tone="accent" />
            </div>
            <div style={{ marginTop: spacing.md }}>
              <Button
                label={`Pay ${formatUSD(t.payCents)}`}
                fullWidth
                onPress={() => applyWalletTopUp(t.payCents, t.creditCents, t.bonusPct)}
              />
            </div>
          </Card>
        ))}
      </div>

      <h2 style={{ fontFamily: fontFamilyWeb.display, fontSize: 24, fontWeight: 900, marginTop: spacing['2xl'], marginBottom: spacing.md }}>
        Recent top-ups
      </h2>
      {wallet.topUps.length === 0 ? (
        <Card>
          <p style={{ color: colors.textMuted, textAlign: 'center' }}>
            No top-ups yet. Try one above — mock mode, no real charges.
          </p>
        </Card>
      ) : (
        <Card padded={false}>
          {wallet.topUps.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: spacing.lg,
                borderBottom: i === wallet.topUps.length - 1 ? 'none' : `1px solid ${colors.border}`,
              }}
            >
              <div>
                <strong>{formatUSD(t.paidCents)} → {formatUSD(t.creditedCents)}</strong>
                <div style={{ fontSize: 12, color: colors.textMuted }}>
                  {new Date(t.at).toLocaleString()}
                </div>
              </div>
              <Badge label={`+${t.bonusPct}%`} tone="success" />
            </div>
          ))}
        </Card>
      )}
    </Layout>
  );
}
