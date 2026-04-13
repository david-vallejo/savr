import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, Chip, PriceTag } from '@app/ui';
import { colors, spacing, radius } from '@app/config';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '../navigation/MainTabs';

const PROTEINS: { key: ProteinOption; label: string }[] = [
  { key: 'chicken', label: '🍗 Chicken' },
  { key: 'steak', label: '🥩 Steak' },
  { key: 'carnitas', label: '🌶️ Carnitas' },
  { key: 'salmon', label: '🐟 Salmon' },
  { key: 'veggie', label: '🥗 Veggie' },
  { key: 'tofu', label: '🫘 Tofu' },
];

const BASES: { key: BaseOption; label: string }[] = [
  { key: 'cilantro-lime', label: 'Cilantro-lime rice' },
  { key: 'rice-white', label: 'White rice' },
  { key: 'rice-brown', label: 'Brown rice' },
  { key: 'greens', label: 'Greens' },
  { key: 'pasta', label: 'Pasta' },
];

const EXTRAS = ['Black beans', 'Pinto beans', 'Corn salsa', 'Pico', 'Fajita veg', 'Cheese', 'Sour cream', 'Lettuce'];

const SAUCES: { key: SaucesOption; label: string }[] = [
  { key: 'salsa-roja', label: 'Salsa roja' },
  { key: 'salsa-verde', label: 'Salsa verde' },
  { key: 'chipotle-crema', label: 'Chipotle crema' },
  { key: 'guacamole', label: 'Guacamole' },
  { key: 'none', label: 'No sauce' },
];

type Props = NativeStackScreenProps<MenuStackParamList, 'MealDetail'>;

export function MealDetailScreen({ route, navigation }: Props) {
  const meal = getMealById(route.params.id);

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
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>Meal not found</Text>
          <Button label="Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
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
    navigation.navigate('MenuList');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing['4xl'] }}>
        <View style={[styles.hero, { backgroundColor: meal.accentColor }]}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={{ fontSize: 140 }}>{meal.imageEmoji}</Text>
        </View>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <View style={styles.tagRow}>
            {meal.tags.map((t) => (
              <Badge key={t} label={t.replace('-', ' ')} tone="neutral" />
            ))}
          </View>
          <Text style={styles.title}>{meal.name}</Text>
          <Text style={styles.tagline}>{meal.tagline}</Text>
          <Text style={styles.desc}>{meal.description}</Text>

          <Card padded={false} style={{ marginTop: spacing.sm }}>
            <View style={styles.statsRow}>
              <Stat label="Calories" value={`${meal.calories}`} />
              <Stat label="Protein" value={`${meal.protein}g`} />
              <Stat label="Spice" value={'🌶️'.repeat(Math.max(1, meal.spicyLevel)) || 'Mild'} />
            </View>
          </Card>

          <Card>
            <Text style={styles.section}>Build your bowl</Text>

            <Label>When do you want it?</Label>
            <Row>
              {[
                { h: 2, label: 'Today' },
                { h: 24, label: 'Tomorrow' },
                { h: 48, label: '2 days' },
                { h: 72, label: '3+ days' },
              ].map((o) => (
                <Chip
                  key={o.h}
                  label={`${o.label}${discountForLeadHours(o.h) ? ` · −${discountForLeadHours(o.h)}%` : ''}`}
                  selected={leadHours === o.h}
                  onPress={() => setLeadHours(o.h)}
                />
              ))}
            </Row>

            <Label>Protein</Label>
            <Row>
              {PROTEINS.map((p) => (
                <Chip key={p.key} label={p.label} selected={protein === p.key} onPress={() => setProtein(p.key)} />
              ))}
            </Row>

            <Label>Base</Label>
            <Row>
              {BASES.map((b) => (
                <Chip key={b.key} label={b.label} selected={base === b.key} onPress={() => setBase(b.key)} />
              ))}
            </Row>

            <Label>Add-ons</Label>
            <Row>
              {EXTRAS.map((e) => (
                <Chip key={e} label={e} selected={extras.includes(e)} onPress={() => toggleExtra(e)} />
              ))}
            </Row>

            <Label>Sauce</Label>
            <Row>
              {SAUCES.map((s) => (
                <Chip key={s.key} label={s.label} selected={sauce === s.key} onPress={() => setSauce(s.key)} />
              ))}
            </Row>

            <Label>Upgrades</Label>
            <Row>
              <Chip
                label="+Guac (+$2.50)"
                selected={addGuac}
                onPress={() => setAddGuac(!addGuac)}
              />
              <Chip
                label="Double protein (+$3.50)"
                selected={doubleProtein}
                onPress={() => setDoubleProtein(!doubleProtein)}
              />
            </Row>

            <View style={styles.bottomBar}>
              <View style={styles.qtyRow}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textMuted }}>Qty</Text>
                <QtyBtn label="−" onPress={() => setQty(Math.max(1, qty - 1))} />
                <Text style={{ fontSize: 16, fontWeight: '800' }}>{qty}</Text>
                <QtyBtn label="+" onPress={() => setQty(qty + 1)} />
              </View>
              <PriceTag cents={price * qty} originalCents={discount > 0 ? original * qty : undefined} size="lg" tone="accent" />
            </View>
            <Button label="Add to cart" size="lg" fullWidth onPress={handleAdd} />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, padding: spacing.md }}>
      <Text style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm }}>
      {children}
    </Text>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>;
}

function QtyBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  backText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.8, color: colors.text },
  tagline: { fontSize: 14, color: colors.textMuted },
  desc: { fontSize: 14, color: colors.text, lineHeight: 21 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSoft,
    borderRadius: radius.md,
  },
  section: { fontSize: 18, fontWeight: '900', color: colors.text },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
