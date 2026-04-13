import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/config';
import { LogoProps } from './types';

export function SavrLogo({ size = 24, tone = 'dark' }: LogoProps) {
  const fg = tone === 'light' ? '#FBF7EE' : colors.text;
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: size * 1.25,
            height: size * 1.25,
            borderRadius: (size * 1.25) / 2,
          },
        ]}
      >
        <Text style={[styles.markText, { fontSize: size * 0.62 }]}>S</Text>
      </View>
      <Text style={[styles.word, { color: fg, fontSize: size }]}>savr</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  word: {
    fontWeight: '900',
    letterSpacing: -0.8,
  },
});
