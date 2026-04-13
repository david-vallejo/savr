import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '@app/config';
import { LayoutProps } from './types';

export function Layout({ children, padded = true }: LayoutProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={padded ? styles.contentPadded : styles.contentFlush}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  contentPadded: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  contentFlush: {
    padding: 0,
  },
});
