import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@app/config';
import { CardProps } from './types';

export function Card({ children, onPress, padded = true, tone = 'default', style }: CardProps) {
  const bg =
    tone === 'inverse' ? colors.bgInverse : tone === 'accent' ? colors.accent : colors.bgPaper;
  const border = tone === 'inverse' ? colors.borderDark : colors.border;

  const base: ViewStyle = {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.lg,
    padding: padded ? spacing.xl : 0,
    overflow: 'hidden',
    ...(style as ViewStyle),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
