import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Layout, PriceTag, SavrLogo } from '@app/ui';
import { APP_NAME, APP_TAGLINE, colors, fontFamilyWeb, radius, spacing, typeScale } from '@app/config';
import { MEALS, PLANS } from '@app/data';

export function Home() {
  const navigate = useNavigate();

  const featured = MEALS.slice(0, 4);
  const popularPlan = PLANS.find((p) => p.badge === 'popular') ?? PLANS[1];

  return (
    <>
      {/* HERO */}
      <section className="savr-gradient-hero">
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: `${spacing['4xl']}px ${spacing.xl}px`,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)',
            gap: spacing['3xl'],
            alignItems: 'center',
          }}
        >
          <div className="savr-reveal" style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Badge label="The Netflix of food subscriptions" tone="brand" size="md" />
            <h1
              style={{
                fontFamily: fontFamilyWeb.display,
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: -1.5,
                color: colors.creamSoft ?? '#FBF7EE',
              }}
            >
              Pre-order lunch.
              <br />
              <span style={{ color: colors.accent }}>Pay up to 30% less.</span>
            </h1>
            <p style={{ fontSize: 18, color: '#E7DFCF', maxWidth: 520, lineHeight: 1.55 }}>
              Savr is a smart food membership. Tell SavrBot what you love — we cook it in bulk, you
              save on every bowl, and pickup or delivery is a tap away.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Button label="See today's menu" size="lg" onPress={() => navigate('/menu')} />
              <Button
                label="Plans from $50"
                size="lg"
                variant="outline"
                onPress={() => navigate('/plans')}
              />
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: spacing.lg, color: '#C9BFA9', fontSize: 13 }}>
              <Stat num="30%" label="avg savings" />
              <Stat num="24h" label="pre-order" />
              <Stat num="6+" label="chef meals daily" />
            </div>
          </div>

          {/* Glass hero card */}
          <div
            className="savr-glass savr-reveal"
            style={{
              borderRadius: radius.xl,
              padding: spacing.xl,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
              color: colors.text,
              maxWidth: 420,
              justifySelf: 'end',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                🔥 Today's heater
              </strong>
              <Badge label="-25% 24h" tone="brand" />
            </div>
            <div style={{ fontSize: 56 }}>{featured[0].imageEmoji}</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: fontFamilyWeb.display }}>
              {featured[0].name}
            </h3>
            <p style={{ fontSize: 14, color: colors.textMuted }}>{featured[0].tagline}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <PriceTag
                cents={Math.round(featured[0].basePrice * 0.75)}
                originalCents={featured[0].basePrice}
                size="lg"
                tone="accent"
              />
              <Button label="Order →" onPress={() => navigate(`/menu/${featured[0].id}`)} />
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ backgroundColor: colors.bg, padding: `${spacing['4xl']}px ${spacing.xl}px` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: fontFamilyWeb.display,
              fontSize: typeScale.display,
              fontWeight: 900,
              letterSpacing: -1,
              marginBottom: spacing.xl,
            }}
          >
            Why people love Savr
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {[
              {
                icon: '🕐',
                title: 'Order ahead, save more',
                body: '24 hours out = 20% off. 72 hours out = 30% off. You win by planning.',
              },
              {
                icon: '🤖',
                title: 'SavrBot plans your week',
                body: 'Your AI food planner learns your faves, allergies, and budget. Weekly plans in one tap.',
              },
              {
                icon: '🧑‍🍳',
                title: 'Chef-cooked, bulk-priced',
                body: 'Real food, not meal-kit assembly. Choose pickup or delivery via Uber/DoorDash.',
              },
              {
                icon: '💳',
                title: 'Wallet = free money',
                body: 'Top up $100, get $115. Load up, eat for weeks, never think about it.',
              },
            ].map((p) => (
              <Card key={p.title}>
                <div style={{ fontSize: 36 }}>{p.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 6 }}>{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MEALS */}
      <section style={{ backgroundColor: colors.bgSoft, padding: `${spacing['4xl']}px ${spacing.xl}px` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: spacing.xl,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: fontFamilyWeb.display,
                  fontSize: typeScale.display,
                  fontWeight: 900,
                  letterSpacing: -1,
                }}
              >
                Today's menu
              </h2>
              <p style={{ color: colors.textMuted, marginTop: 6 }}>
                Rotated weekly. Fresh today. Pre-order for tomorrow and save.
              </p>
            </div>
            <Button label="See full menu" variant="outline" onPress={() => navigate('/menu')} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {featured.map((m) => (
              <MealCardMini
                key={m.id}
                meal={m}
                onPress={() => navigate(`/menu/${m.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PLAN */}
      <section style={{ backgroundColor: colors.bg, padding: `${spacing['4xl']}px ${spacing.xl}px` }}>
        <Layout>
          <Card tone="inverse" padded={false}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                alignItems: 'center',
                padding: spacing['3xl'],
                gap: spacing['2xl'],
              }}
            >
              <div>
                <Badge label="Most popular" tone="accent" size="md" />
                <h2
                  style={{
                    fontFamily: fontFamilyWeb.display,
                    fontSize: 40,
                    fontWeight: 900,
                    letterSpacing: -1,
                    color: colors.creamSoft ?? '#FBF7EE',
                    marginTop: 12,
                  }}
                >
                  {popularPlan.name}
                </h2>
                <p style={{ color: '#C9BFA9', fontSize: 16, marginTop: 8 }}>{popularPlan.tagline}</p>
                <ul style={{ listStyle: 'none', marginTop: spacing.lg, color: '#E7DFCF' }}>
                  {popularPlan.perks.map((p) => (
                    <li key={p} style={{ padding: '6px 0', display: 'flex', gap: 10 }}>
                      <span style={{ color: colors.accent }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', marginBottom: 16 }}>
                  <SavrLogo size={28} tone="light" />
                </div>
                <PriceTag cents={popularPlan.priceCents} size="lg" tone="accent" />
                <div style={{ color: '#C9BFA9', fontSize: 13, marginTop: 6 }}>
                  Save {popularPlan.savingsPct}% vs single meals
                </div>
                <div style={{ marginTop: spacing.lg }}>
                  <Button
                    label="Get this plan"
                    size="lg"
                    onPress={() => navigate('/plans')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Layout>
      </section>

      {/* CTA BANNER */}
      <section style={{ backgroundColor: colors.bgSoft, padding: `${spacing['4xl']}px ${spacing.xl}px` }}>
        <Layout>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: spacing.md,
            }}
          >
            <h2
              style={{
                fontFamily: fontFamilyWeb.display,
                fontSize: typeScale.displayLg,
                fontWeight: 900,
                letterSpacing: -1,
                maxWidth: 720,
              }}
            >
              Tomorrow's lunch is already done.
            </h2>
            <p style={{ color: colors.textMuted, maxWidth: 520 }}>
              Create a free account, and SavrBot will plan your first week before you're done with this page.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button label="Start free" size="lg" onPress={() => navigate('/login')} />
              <Button
                label="Chat with SavrBot"
                size="lg"
                variant="outline"
                onPress={() => navigate('/login')}
              />
            </div>
          </div>
        </Layout>
      </section>
    </>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 900, color: colors.creamSoft ?? '#FBF7EE' }}>{num}</div>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function MealCardMini({
  meal,
  onPress,
}: {
  meal: (typeof MEALS)[number];
  onPress: () => void;
}) {
  const discounted = Math.round(meal.basePrice * 0.8);
  return (
    <Card onPress={onPress} padded={false}>
      <div
        style={{
          height: 130,
          background: `linear-gradient(135deg, ${meal.accentColor}, ${colors.charcoalSoft ?? '#2A2320'})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
        }}
      >
        {meal.imageEmoji}
      </div>
      <div style={{ padding: spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>{meal.name}</h3>
          <Badge label="-20%" tone="brand" />
        </div>
        <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 6, minHeight: 34 }}>
          {meal.tagline}
        </p>
        <div style={{ marginTop: spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <PriceTag cents={discounted} originalCents={meal.basePrice} size="md" tone="accent" />
          <span style={{ fontSize: 12, color: colors.textMuted }}>{meal.calories} cal · {meal.protein}g P</span>
        </div>
      </div>
    </Card>
  );
}
