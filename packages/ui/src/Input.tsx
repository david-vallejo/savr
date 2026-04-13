import React from 'react';
import { colors, radius, spacing, fontFamilyWeb } from '@app/config';
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
  const inputStyle: React.CSSProperties = {
    padding: `${spacing.md}px ${spacing.lg}px`,
    border: `1.5px solid ${error ? colors.danger : colors.border}`,
    borderRadius: radius.md,
    fontSize: 15,
    fontFamily: fontFamilyWeb.sans,
    color: colors.text,
    backgroundColor: colors.bgPaper,
    outline: 'none',
    width: '100%',
    resize: 'vertical',
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label ? (
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>{label}</span>
      ) : null}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={3}
          style={inputStyle}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          autoFocus={autoFocus}
          style={inputStyle}
        />
      )}
      {error ? (
        <span style={{ fontSize: 12, color: colors.danger }}>{error}</span>
      ) : null}
    </label>
  );
}
