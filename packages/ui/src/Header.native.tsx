import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@app/config';
import { HeaderProps } from './types';

export function Header({ title, subtitle, rightAction, leftAction, transparent }: HeaderProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : colors.bgPaper,
          borderBottomColor: transparent ? 'transparent' : colors.border,
        },
      ]}
    >
      {leftAction ? (
        <Pressable onPress={leftAction.onPress} style={styles.leftBtn}>
          <Text style={styles.leftText}>{leftAction.label}</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? (
        <Pressable onPress={rightAction.onPress} style={styles.rightBtn}>
          <Text style={styles.rightText}>{rightAction.label}</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  leftBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rightBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  leftText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rightText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  spacer: {
    width: 44,
  },
});
