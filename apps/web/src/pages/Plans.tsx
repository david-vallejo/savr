import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { PLANS } from '@app/data';

export function Plans() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto', marginBottom: spacing['2xl'] }}>
        <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.displayLg, fontWeight: 900, letterSpacing: -1.2 }}>
          Plans that pay you back
        </h1>
        <p style={{ color: colors.textMuted, marginTop: spacing.md, fontSize: 17 }}>
          Prepay, save big, eat chef-cooked. Skip, pause, swap anytime.
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {PLANS.map((plan) => {
          const isBest = plan.badge === 'best-value';
          return (
            <Card
              key={plan.id}
              tone={isBest ? 'inverse' : 'default'}
              padded={false}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: spacing.xl, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2
                    style={{
                      fontFamily: fontFamilyWeb.display,
                      fontSize: 22,
                      fontWeight: 900,
                      color: isBest ? '#FBF7EE' : colors.text,
                    }}
                  >
                    {plan.name}
                  </h2>
                  {plan.badge ? (
                    <Badge
                      label={plan.badge.replace('-', ' ')}
                      tone={isBest ? 'accent' : 'brand'}
                    />
                  ) : null}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: isBest ? '#C9BFA9' : colors.textMuted,
                    marginTop: 6,
                    minHeight: 40,
                  }}
                >
                  {plan.tagline}
                </p>
                <div style={{ marginTop: spacing.lg }}>
                  {plan.priceCents > 0 ? (
                    <PriceTag cents={plan.priceCents} size="lg" tone="accent" />
                  ) : (
                    <div style={{ fontFamily: fontFamilyWeb.display, fontSize: 26, fontWeight: 900, color: isBest ? '#FBF7EE' : colors.text }}>
                      Let's talk
                    </div>
                  )}
                  {plan.savingsPct > 0 ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: isBest ? '#C9BFA9' : colors.textMuted,
                        marginTop: 4,
                      }}
                    >
                      Save {plan.savingsPct}% · {plan.meals} meals{' '}
                      {plan.cadence === 'weekly' ? 'per week' : plan.cadence === 'monthly' ? 'per month' : 'total'}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        color: isBest ? '#C9BFA9' : colors.textMuted,
                        marginTop: 4,
                      }}
                    >
                      Custom volume pricing
                    </div>
                  )}
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    marginTop: spacing.lg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {plan.perks.map((p) => (
                    <li
                      key={p}
                      style={{
                        display: 'flex',
                        gap: 10,
                        fontSize: 14,
                        color: isBest ? '#E7DFCF' : colors.text,
                      }}
                    >
                      <span style={{ color: colors.accent, fontWeight: 800 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: spacing.xl, borderTop: `1px solid ${isBest ? '#2A2320' : colors.border}` }}>
                <Button
                  label={plan.priceCents > 0 ? 'Start this plan' : 'Contact sales'}
                  fullWidth
                  onPress={() => navigate(plan.priceCents > 0 ? '/wallet' : '/dashboard')}
                  variant={isBest ? 'accent' : 'primary'}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}
