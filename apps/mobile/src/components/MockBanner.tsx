import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/config';

export function MockBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🧪 Mock mode · use user / password</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.warningBg,
  },
  text: {
    fontSize: 12,
    color: colors.warningText,
    textAlign: 'center',
    fontWeight: '600',
  },
});
