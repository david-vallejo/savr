import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Chip, Layout, SavrLogo } from '@app/ui';
import { colors, fontFamilyWeb, radius, spacing, typeScale } from '@app/config';
import { useBot, sendBotMessage, runBotAction } from '@app/data';

export function Bot() {
  const messages = useBot();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendBotMessage(input.trim());
    setInput('');
  }

  function handleSuggestion(action: string) {
    if (action === 'goto-cart') return navigate('/cart');
    if (action === 'goto-menu') return navigate('/menu');
    runBotAction(action);
  }

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: spacing.lg }}>
        <SavrLogo size={24} />
        <div style={{ fontSize: 13, color: colors.textMuted, padding: '4px 10px', border: `1px solid ${colors.border}`, borderRadius: 999 }}>
          SavrBot · beta
        </div>
      </div>
      <h1 style={{ fontFamily: fontFamilyWeb.display, fontSize: typeScale.display, fontWeight: 900, letterSpacing: -1 }}>
        Your food planner
      </h1>
      <p style={{ color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg }}>
        Tell me your goals, budget, or craving. I'll build a weekly plan and lock in the pre-order savings.
      </p>

      <Card padded={false}>
        <div
          ref={scrollRef}
          style={{
            maxHeight: 540,
            overflowY: 'auto',
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 18,
                  backgroundColor: m.role === 'user' ? colors.brand : colors.bgSoft,
                  color: m.role === 'user' ? colors.brandOn : colors.text,
                  fontSize: 14,
                  lineHeight: 1.5,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 18,
                  borderBottomLeftRadius: m.role === 'user' ? 18 : 4,
                }}
              >
                {m.text}
              </div>
              {m.suggestions && m.suggestions.length > 0 ? (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {m.suggestions.map((s) => (
                    <Chip key={s.action} label={s.label} onPress={() => handleSuggestion(s.action)} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <form
          onSubmit={submit}
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: spacing.md,
            display: 'flex',
            gap: 8,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a plan, a deal, or swap a meal…"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: radius.pill,
              border: `1.5px solid ${colors.border}`,
              background: colors.bgPaper,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <Button label="Send" onPress={() => {}} type="submit" />
        </form>
      </Card>
    </Layout>
  );
}
