import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@app/config';
import { ButtonProps } from './types';

const sizeStyles = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: 13 },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: 15 },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'], fontSize: 17 },
};

const variantBg: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: colors.brand,
  secondary: colors.bgInverse,
  outline: 'transparent',
  ghost: 'transparent',
  accent: colors.accent,
};

const variantText: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: colors.brandOn,
  secondary: colors.textOnDark,
  outline: colors.text,
  ghost: colors.text,
  accent: colors.accentOn,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leadingIcon,
}: ButtonProps) {
  const s = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantBg[variant],
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        variant === 'outline' && {
          borderWidth: 1.5,
          borderColor: colors.borderStrong,
        },
      ]}
    >
      <View style={styles.row}>
        {leadingIcon != null ? (
          <Text style={[styles.icon, { color: variantText[variant] }]}>{String(leadingIcon)}</Text>
        ) : null}
        <Text style={[styles.label, { color: variantText[variant], fontSize: s.fontSize }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
