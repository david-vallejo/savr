import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/config';
import { PriceTagProps } from './types';

const sizeMap = { sm: 14, md: 18, lg: 26 };

function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function PriceTag({ cents, originalCents, size = 'md', tone = 'default' }: PriceTagProps) {
  const hasDiscount = originalCents != null && originalCents > cents;
  const color = tone === 'accent' ? colors.brand : colors.text;
  const fontSize = sizeMap[size];

  return (
    <View style={styles.row}>
      <Text style={[styles.price, { fontSize, color }]}>{formatUSD(cents)}</Text>
      {hasDiscount ? (
        <Text style={[styles.original, { fontSize: Math.round(fontSize * 0.7) }]}>
          {formatUSD(originalCents!)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  price: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  original: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
