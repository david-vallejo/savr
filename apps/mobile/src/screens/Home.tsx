import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, PriceTag, SavrLogo } from '@app/ui';
import { APP_TAGLINE, colors, radius, spacing } from '@app/config';
import { MEALS } from '@app/data';
import { MockBanner } from '../components/MockBanner';
import { useAuth } from '@app/auth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const { isMockMode } = useAuth();
  const featured = MEALS[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {isMockMode && <MockBanner />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <SavrLogo size={22} tone="light" />
          <View style={{ height: spacing.xl }} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>The Netflix of food subscriptions</Text>
          </View>
          <Text style={styles.headline}>
            Pre-order lunch.{'\n'}
            <Text style={{ color: colors.accent }}>Pay up to 30% less.</Text>
          </Text>
          <Text style={styles.sub}>{APP_TAGLINE}</Text>
          <Text style={styles.subBody}>
            Tell SavrBot what you love — we cook it in bulk, you save on every bowl, pickup or delivery in a tap.
          </Text>
          <View style={styles.ctaRow}>
            <Button label="Get started" size="lg" onPress={() => navigation.navigate('Login')} />
            <Button
              label="Sign in"
              size="lg"
              variant="outline"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
          <View style={styles.stats}>
            <Stat num="30%" label="avg savings" />
            <Stat num="24h" label="pre-order" />
            <Stat num="6+" label="daily meals" />
          </View>
        </View>

        {/* Deal card */}
        <View style={{ padding: spacing.lg }}>
          <Card padded={false}>
            <View
              style={{
                height: 140,
                backgroundColor: featured.accentColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 72 }}>{featured.imageEmoji}</Text>
            </View>
            <View style={{ padding: spacing.lg }}>
              <Badge label="🔥 Today's heater — 25% off" tone="brand" />
              <Text style={styles.cardTitle}>{featured.name}</Text>
              <Text style={styles.cardBody}>{featured.tagline}</Text>
              <View style={styles.priceRow}>
                <PriceTag
                  cents={Math.round(featured.basePrice * 0.75)}
                  originalCents={featured.basePrice}
                  size="lg"
                  tone="accent"
                />
                <Button label="Order →" onPress={() => navigation.navigate('Login')} />
              </View>
            </View>
          </Card>
        </View>

        {/* Pillars */}
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Text style={styles.sectionTitle}>Why people love Savr</Text>
          {[
            { icon: '🕐', title: 'Order ahead, save more', body: '24h out = 20% off. 72h out = 30% off.' },
            { icon: '🤖', title: 'SavrBot plans your week', body: 'Your AI planner for deals, budget and goals.' },
            { icon: '🧑‍🍳', title: 'Chef-cooked, bulk-priced', body: 'Real food. Pickup or delivery on demand.' },
            { icon: '💳', title: 'Wallet = free money', body: 'Top up $100, get $115. Never expires.' },
          ].map((p) => (
            <Card key={p.title}>
              <Text style={{ fontSize: 30 }}>{p.icon}</Text>
              <Text style={styles.pillarTitle}>{p.title}</Text>
              <Text style={styles.pillarBody}>{p.body}</Text>
            </Card>
          ))}
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <View>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    backgroundColor: colors.bgInverse,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  heroBadgeText: {
    color: colors.brandOn,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headline: {
    color: colors.creamSoft,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.2,
    lineHeight: 44,
    marginTop: spacing.md,
  },
  sub: {
    color: '#C9BFA9',
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  subBody: {
    color: '#C9BFA9',
    fontSize: 14,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  statNum: {
    color: colors.creamSoft,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: '#C9BFA9',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginTop: 10,
  },
  cardBody: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  pillarBody: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
