import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@app/config';
import { BadgeProps, BadgeTone } from './types';

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  brand: { bg: colors.brand, fg: colors.brandOn },
  accent: { bg: colors.accent, fg: colors.accentOn },
  success: { bg: '#E4F2E1', fg: colors.secondaryDark },
  warn: { bg: colors.warningBg, fg: colors.warningText },
  neutral: { bg: colors.bgSoft, fg: colors.text },
  inverse: { bg: colors.bgInverse, fg: colors.textOnDark },
};

export function Badge({ label, tone = 'neutral', size = 'sm' }: BadgeProps) {
  const { bg, fg } = tones[tone];
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          paddingVertical: size === 'md' ? 5 : 3,
          paddingHorizontal: size === 'md' ? 10 : 8,
        },
      ]}
    >
      <Text style={[styles.text, { color: fg, fontSize: size === 'md' ? 12 : 11 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
