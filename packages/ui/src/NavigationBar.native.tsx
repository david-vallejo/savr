import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing } from '@app/config';
import { NavigationBarProps } from './types';

export function NavigationBar({ items }: NavigationBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          style={[styles.item, item.active && styles.activeItem]}
        >
          <Text style={[styles.label, item.active && styles.activeLabel]}>{item.label}</Text>
          {item.badge != null && item.badge !== '' ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{String(item.badge)}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSoft,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    marginRight: spacing.xs,
  },
  activeItem: {
    backgroundColor: colors.bgInverse,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeLabel: {
    color: colors.textOnDark,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.brandOn,
    fontSize: 11,
    fontWeight: '700',
  },
});
