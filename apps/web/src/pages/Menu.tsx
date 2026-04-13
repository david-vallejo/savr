import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Chip, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, spacing, typeScale } from '@app/config';
import { MEALS, Meal, discountForLeadHours, effectivePriceCents } from '@app/data';

const CATEGORIES: { key: Meal['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bowl', label: 'Bowls' },
  { key: 'plate', label: 'Plates' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'veggie', label: 'Veggie' },
  { key: 'family', label: 'Family' },
  { key: 'kids', label: 'Kids' },
];

export function Menu() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]['key']>('all');
  const [leadHours, setLeadHours] = useState(24);

  const meals = useMemo(
    () => (filter === 'all' ? MEALS : MEALS.filter((m) => m.category === filter)),
    [filter]
  );

  const discount = discountForLeadHours(leadHours);

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1 }}>
              Today's menu
            </h1>
            <p style={{ color: colors.textMuted, marginTop: 4 }}>
              {MEALS.length} chef-cooked dishes · rotated weekly
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>Pre-order</span>
            <select
              value={leadHours}
              onChange={(e) => setLeadHours(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: `1.5px solid ${colors.border}`,
                background: colors.bgPaper,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value={2}>Today (full price)</option>
              <option value={24}>24h ahead (−20%)</option>
              <option value={48}>48h ahead (−25%)</option>
              <option value={72}>72h ahead (−30%)</option>
            </select>
            <Badge label={`${discount}% off`} tone="brand" size="md" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              selected={filter === c.key}
              onPress={() => setFilter(c.key)}
            />
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {meals.map((m) => (
            <Card
              key={m.id}
              onPress={() => navigate(`/menu/${m.id}`)}
              padded={false}
            >
              <div
                style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${m.accentColor}, ${colors.charcoalSoft ?? '#2A2320'})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 78,
                  position: 'relative',
                }}
              >
                {m.imageEmoji}
                {m.tags.includes('chef-pick') ? (
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge label="Chef's pick" tone="accent" />
                  </div>
                ) : null}
                {m.tags.includes('new') ? (
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge label="New" tone="accent" />
                  </div>
                ) : null}
              </div>
              <div style={{ padding: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>{m.name}</h3>
                  <Badge label={`${m.protein}g P`} tone="success" />
                </div>
                <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 6, minHeight: 32 }}>
                  {m.tagline}
                </p>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <PriceTag
                    cents={effectivePriceCents(m, undefined, discount)}
                    originalCents={discount > 0 ? m.basePrice : undefined}
                    tone="accent"
                  />
                  <span style={{ fontSize: 12, color: colors.textMuted }}>{m.calories} cal</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
