import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Card, Chip, PriceTag } from '@app/ui';
import { colors, spacing, radius } from '@app/config';
import { MEALS, Meal, discountForLeadHours, effectivePriceCents } from '@app/data';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '../navigation/MainTabs';

const CATEGORIES: { key: Meal['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bowl', label: 'Bowls' },
  { key: 'plate', label: 'Plates' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'veggie', label: 'Veggie' },
  { key: 'family', label: 'Family' },
  { key: 'kids', label: 'Kids' },
];

type Props = NativeStackScreenProps<MenuStackParamList, 'MenuList'>;

export function MenuScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]['key']>('all');
  const [leadHours, setLeadHours] = useState(24);

  const meals = useMemo(
    () => (filter === 'all' ? MEALS : MEALS.filter((m) => m.category === filter)),
    [filter]
  );
  const discount = discountForLeadHours(leadHours);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Today's menu</Text>
        <Text style={styles.sub}>
          {MEALS.length} chef-cooked dishes · rotated weekly
        </Text>

        {/* Lead time selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.leadRow}
        >
          {[
            { h: 2, label: 'Today' },
            { h: 24, label: '24h' },
            { h: 48, label: '48h' },
            { h: 72, label: '72h' },
          ].map((o) => {
            const d = discountForLeadHours(o.h);
            return (
              <Chip
                key={o.h}
                label={`${o.label}${d ? ` · −${d}%` : ''}`}
                selected={leadHours === o.h}
                onPress={() => setLeadHours(o.h)}
              />
            );
          })}
        </ScrollView>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              selected={filter === c.key}
              onPress={() => setFilter(c.key)}
            />
          ))}
        </ScrollView>

        {meals.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => navigation.navigate('MealDetail', { id: m.id })}
            style={{ marginBottom: spacing.md }}
          >
            <Card padded={false}>
              <View style={[styles.cardHero, { backgroundColor: m.accentColor }]}>
                <Text style={{ fontSize: 72 }}>{m.imageEmoji}</Text>
                {m.tags.includes('chef-pick') && (
                  <View style={styles.cornerBadge}>
                    <Badge label="Chef's pick" tone="accent" />
                  </View>
                )}
                {m.tags.includes('new') && (
                  <View style={[styles.cornerBadge, { right: 10, left: undefined }]}>
                    <Badge label="New" tone="accent" />
                  </View>
                )}
              </View>
              <View style={{ padding: spacing.lg }}>
                <View style={styles.titleRow}>
                  <Text style={styles.mealName}>{m.name}</Text>
                  <Badge label={`${m.protein}g P`} tone="success" />
                </View>
                <Text style={styles.mealTag}>{m.tagline}</Text>
                <View style={styles.priceRow}>
                  <PriceTag
                    cents={effectivePriceCents(m, undefined, discount)}
                    originalCents={discount > 0 ? m.basePrice : undefined}
                    tone="accent"
                  />
                  <Text style={styles.kcal}>{m.calories} cal</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  leadRow: { gap: 8, paddingVertical: spacing.md },
  catRow: { gap: 8, paddingBottom: spacing.lg },
  cardHero: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerBadge: { position: 'absolute', top: 10, left: 10 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: { fontSize: 17, fontWeight: '800', color: colors.text, flex: 1, paddingRight: 8 },
  mealTag: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  priceRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kcal: { fontSize: 12, color: colors.textMuted },
});
