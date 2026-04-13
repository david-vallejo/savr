import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, Chip, Layout, PriceTag } from '@app/ui';
import { colors, fontFamilyWeb, radius, spacing } from '@app/config';
import {
  getMealById,
  addToCart,
  discountForLeadHours,
  effectivePriceCents,
  BowlCustomization,
  ProteinOption,
  BaseOption,
  SaucesOption,
} from '@app/data';

const PROTEINS: { key: ProteinOption; label: string; icon: string }[] = [
  { key: 'chicken', label: 'Chicken', icon: '🍗' },
  { key: 'steak', label: 'Steak', icon: '🥩' },
  { key: 'carnitas', label: 'Carnitas', icon: '🌶️' },
  { key: 'salmon', label: 'Salmon', icon: '🐟' },
  { key: 'veggie', label: 'Veggie', icon: '🥗' },
  { key: 'tofu', label: 'Tofu', icon: '🫘' },
];

const BASES: { key: BaseOption; label: string }[] = [
  { key: 'cilantro-lime', label: 'Cilantro-lime rice' },
  { key: 'rice-white', label: 'White rice' },
  { key: 'rice-brown', label: 'Brown rice' },
  { key: 'greens', label: 'Greens' },
  { key: 'pasta', label: 'Pasta' },
];

const EXTRAS = [
  'Black beans',
  'Pinto beans',
  'Corn salsa',
  'Pico de gallo',
  'Fajita veg',
  'Cheese',
  'Sour cream',
  'Lettuce',
];

const SAUCES: { key: SaucesOption; label: string }[] = [
  { key: 'salsa-roja', label: 'Salsa roja' },
  { key: 'salsa-verde', label: 'Salsa verde' },
  { key: 'chipotle-crema', label: 'Chipotle crema' },
  { key: 'guacamole', label: 'Guacamole' },
  { key: 'none', label: 'No sauce' },
];

export function MealDetail() {
  const { id } = useParams<{ id: string }>();
  const meal = id ? getMealById(id) : undefined;
  const navigate = useNavigate();

  const [leadHours, setLeadHours] = useState(24);
  const [protein, setProtein] = useState<ProteinOption>('chicken');
  const [base, setBase] = useState<BaseOption>('cilantro-lime');
  const [extras, setExtras] = useState<string[]>(['Black beans', 'Corn salsa']);
  const [sauce, setSauce] = useState<SaucesOption>('salsa-roja');
  const [addGuac, setAddGuac] = useState(false);
  const [doubleProtein, setDoubleProtein] = useState(false);
  const [qty, setQty] = useState(1);

  const customization: BowlCustomization = useMemo(
    () => ({ protein, base, extras, sauce, addGuac, doubleProtein }),
    [protein, base, extras, sauce, addGuac, doubleProtein]
  );

  if (!meal) {
    return (
      <Layout>
        <div style={{ padding: spacing.xl, textAlign: 'center' }}>
          <h1>Meal not found</h1>
          <Button label="Back to menu" onPress={() => navigate('/menu')} />
        </div>
      </Layout>
    );
  }

  const discount = discountForLeadHours(leadHours);
  const price = effectivePriceCents(meal, customization, discount);
  const original = effectivePriceCents(meal, customization, 0);

  function toggleExtra(e: string) {
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  }

  function handleAdd() {
    if (!meal) return;
    const d = new Date();
    d.setHours(d.getHours() + leadHours);
    d.setMinutes(0, 0, 0);
    for (let i = 0; i < qty; i++) {
      addToCart({ meal, customization, scheduledFor: d.toISOString() });
    }
    navigate('/cart');
  }

  return (
    <Layout>
      <button
        onClick={() => navigate('/menu')}
        style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', marginBottom: spacing.lg, fontSize: 14, fontWeight: 600 }}
      >
        ← Back to menu
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: spacing['2xl'] }}>
        {/* HERO */}
        <div>
          <Card padded={false}>
            <div
              style={{
                height: 360,
                background: `linear-gradient(135deg, ${meal.accentColor}, ${colors.charcoalSoft ?? '#2A2320'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 160,
              }}
            >
              {meal.imageEmoji}
            </div>
            <div style={{ padding: spacing.xl }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {meal.tags.map((t) => (
                  <Badge key={t} label={t.replace('-', ' ')} tone="neutral" />
                ))}
              </div>
              <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: 36, fontWeight: 900, marginTop: spacing.md, letterSpacing: -0.6 }}>
                {meal.name}
              </h1>
              <p style={{ color: colors.textMuted, marginTop: 6, fontSize: 15 }}>{meal.tagline}</p>
              <p style={{ marginTop: spacing.md, color: colors.text, fontSize: 15, lineHeight: 1.6 }}>
                {meal.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: spacing.xl,
                  marginTop: spacing.xl,
                  padding: spacing.lg,
                  backgroundColor: colors.bgSoft,
                  borderRadius: radius.md,
                }}
              >
                <Stat label="Calories" value={`${meal.calories}`} />
                <Stat label="Protein" value={`${meal.protein}g`} />
                <Stat label="Spice" value={'🌶️'.repeat(Math.max(1, meal.spicyLevel)) || 'Mild'} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: spacing.xl, marginBottom: 8 }}>Ingredients</h3>
              <p style={{ color: colors.textMuted, fontSize: 14 }}>{meal.ingredients.join(' · ')}</p>
            </div>
          </Card>
        </div>

        {/* BUILDER */}
        <div style={{ position: 'sticky', top: 120, alignSelf: 'flex-start' }}>
          <Card>
            <h2 style={{ fontFamily: fontFamilyWeb.display, fontSize: 22, fontWeight: 800 }}>Build your bowl</h2>
            <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
              Customize, choose a time, save more.
            </p>

            <Section title="When do you want it?" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { h: 2, label: 'Today' },
                { h: 24, label: 'Tomorrow' },
                { h: 48, label: '2 days' },
                { h: 72, label: '3+ days' },
              ].map((o) => (
                <Chip
                  key={o.h}
                  label={`${o.label} ${discountForLeadHours(o.h) ? `· −${discountForLeadHours(o.h)}%` : ''}`}
                  selected={leadHours === o.h}
                  onPress={() => setLeadHours(o.h)}
                />
              ))}
            </div>

            <Section title="Protein" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROTEINS.map((p) => (
                <Chip
                  key={p.key}
                  label={`${p.icon} ${p.label}`}
                  selected={protein === p.key}
                  onPress={() => setProtein(p.key)}
                />
              ))}
            </div>

            <Section title="Base" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BASES.map((b) => (
                <Chip
                  key={b.key}
                  label={b.label}
                  selected={base === b.key}
                  onPress={() => setBase(b.key)}
                />
              ))}
            </div>

            <Section title="Add-ons" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EXTRAS.map((e) => (
                <Chip
                  key={e}
                  label={e}
                  selected={extras.includes(e)}
                  onPress={() => toggleExtra(e)}
                />
              ))}
            </div>

            <Section title="Sauce" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SAUCES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={sauce === s.key}
                  onPress={() => setSauce(s.key)}
                />
              ))}
            </div>

            <Section title="Upgrades" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Chip
                label={`+Guac (+$2.50)`}
                selected={addGuac}
                onPress={() => setAddGuac(!addGuac)}
              />
              <Chip
                label={`Double protein (+$3.50)`}
                selected={doubleProtein}
                onPress={() => setDoubleProtein(!doubleProtein)}
              />
            </div>

            <div
              style={{
                marginTop: spacing.xl,
                paddingTop: spacing.lg,
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.textMuted }}>Quantity</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <QtyBtn label="−" onPress={() => setQty(Math.max(1, qty - 1))} />
                  <strong style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>{qty}</strong>
                  <QtyBtn label="+" onPress={() => setQty(qty + 1)} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.textMuted }}>Total</span>
                <PriceTag cents={price * qty} originalCents={discount > 0 ? original * qty : undefined} size="lg" tone="accent" />
              </div>
              <Button label="Add to cart" size="lg" fullWidth onPress={handleAdd} />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.textMuted,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
      }}
    >
      {title}
    </h3>
  );
}

function QtyBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        border: `1.5px solid ${colors.borderStrong}`,
        background: colors.bgPaper,
        cursor: 'pointer',
        fontSize: 16,
        fontWeight: 800,
      }}
    >
      {label}
    </button>
  );
}
