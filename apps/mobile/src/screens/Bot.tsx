import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, SavrLogo } from '@app/ui';
import { colors, radius, spacing } from '@app/config';
import { useBot, sendBotMessage, runBotAction } from '@app/data';

export function BotScreen({ navigation }: any) {
  const messages = useBot();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  function submit() {
    if (!input.trim()) return;
    sendBotMessage(input.trim());
    setInput('');
  }

  function handleSuggestion(action: string) {
    if (action === 'goto-cart') return navigation.navigate('Cart');
    if (action === 'goto-menu') return navigation.navigate('Menu');
    runBotAction(action);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <SavrLogo size={20} />
          <Text style={styles.tag}>SavrBot · beta</Text>
        </View>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubbleWrap,
                { alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' },
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  m.role === 'user'
                    ? { backgroundColor: colors.brand, borderBottomRightRadius: 4 }
                    : { backgroundColor: colors.bgSoft, borderBottomLeftRadius: 4 },
                ]}
              >
                <Text style={{ color: m.role === 'user' ? colors.brandOn : colors.text, fontSize: 14, lineHeight: 20 }}>
                  {m.text}
                </Text>
              </View>
              {m.suggestions && m.suggestions.length > 0 && (
                <View style={styles.suggestRow}>
                  {m.suggestions.map((s) => (
                    <Chip key={s.action} label={s.label} onPress={() => handleSuggestion(s.action)} />
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask for a plan, a deal, or swap a meal…"
            placeholderTextColor={colors.textDim}
            style={styles.input}
            onSubmitEditing={submit}
          />
          <Pressable onPress={submit} style={styles.send}>
            <Text style={{ color: colors.brandOn, fontWeight: '800' }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgPaper,
  },
  tag: {
    fontSize: 11,
    color: colors.textMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontWeight: '700',
  },
  bubbleWrap: { maxWidth: '84%', gap: 8 },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  suggestRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  inputBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgPaper,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.bgPaper,
  },
  send: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
});
