import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, PriceTag } from '@app/ui';
import { colors, spacing } from '@app/config';
import { PLANS } from '@app/data';

export function PlansScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}>
        <Text style={styles.h1}>Plans that pay you back</Text>
        <Text style={styles.sub}>
          Prepay, save big, eat chef-cooked. Skip, pause, swap anytime.
        </Text>

        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {PLANS.map((plan) => {
            const isBest = plan.badge === 'best-value';
            return (
              <Card key={plan.id} tone={isBest ? 'inverse' : 'default'}>
                <View style={styles.planHead}>
                  <Text
                    style={[
                      styles.planName,
                      { color: isBest ? colors.creamSoft : colors.text },
                    ]}
                  >
                    {plan.name}
                  </Text>
                  {plan.badge ? (
                    <Badge label={plan.badge.replace('-', ' ')} tone={isBest ? 'accent' : 'brand'} />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.planTag,
                    { color: isBest ? '#C9BFA9' : colors.textMuted },
                  ]}
                >
                  {plan.tagline}
                </Text>
                <View style={{ marginTop: spacing.md }}>
                  {plan.priceCents > 0 ? (
                    <PriceTag cents={plan.priceCents} size="lg" tone="accent" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: '900',
                        color: isBest ? colors.creamSoft : colors.text,
                      }}
                    >
                      Let's talk
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: spacing.md, gap: 6 }}>
                  {plan.perks.map((p) => (
                    <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
                      <Text style={{ color: colors.accent, fontWeight: '800' }}>✓</Text>
                      <Text style={{ fontSize: 14, color: isBest ? '#E7DFCF' : colors.text, flex: 1 }}>
                        {p}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{ marginTop: spacing.lg }}>
                  <Button
                    label={plan.priceCents > 0 ? 'Start plan' : 'Contact sales'}
                    fullWidth
                    variant={isBest ? 'accent' : 'primary'}
                    onPress={() => navigation.navigate('Wallet')}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  sub: { color: colors.textMuted, marginTop: 6, fontSize: 14 },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  planTag: { fontSize: 14, marginTop: 4 },
});
