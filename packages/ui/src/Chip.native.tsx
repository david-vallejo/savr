import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '@app/config';
import { ChipProps } from './types';

export function Chip({ label, selected, onPress, leadingIcon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: selected ? colors.brand : colors.borderStrong,
          backgroundColor: selected ? colors.brand : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        {leadingIcon != null ? <Text>{String(leadingIcon)}</Text> : null}
        <Text
          style={[
            styles.label,
            { color: selected ? colors.brandOn : colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
