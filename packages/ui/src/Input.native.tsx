import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@app/config';
import { InputProps } from './types';

export function Input({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  autoFocus,
  error,
  multiline,
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        autoFocus={autoFocus}
        secureTextEntry={type === 'password'}
        keyboardType={
          type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'
        }
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        style={[
          styles.input,
          multiline && styles.multiline,
          { borderColor: error ? colors.danger : colors.border },
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.bgPaper,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    color: colors.danger,
  },
});
