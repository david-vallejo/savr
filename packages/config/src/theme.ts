/**
 * Savr design tokens — shared between web (CSS-in-JS) and mobile (StyleSheet).
 * Keep values as plain JS so both platforms can consume them identically.
 */

export const palette = {
  // Brand core
  charcoal: '#1A1512',
  charcoalSoft: '#2A2320',
  ember: '#E86A2C',
  tomato: '#C8102E',
  tomatoDark: '#8A0B20',
  avocado: '#5A8C3A',
  avocadoDark: '#3E6326',

  // Surfaces
  cream: '#F7F1E6',
  creamSoft: '#FBF7EE',
  paper: '#FFFFFF',
  ink: '#130F0C',

  // Neutrals
  mute100: '#F4EEE3',
  mute200: '#E7DFCF',
  mute300: '#C9BFA9',
  mute400: '#9A9183',
  mute500: '#6A6358',
  mute600: '#453F36',

  // Semantic
  success: '#2E7D32',
  warning: '#C98A00',
  danger: '#C8102E',
  info: '#1E6FA8',
} as const;

export const colors = {
  // Role-based tokens — prefer these in components
  bg: palette.cream,
  bgSoft: palette.creamSoft,
  bgPaper: palette.paper,
  bgInverse: palette.charcoal,
  bgInverseSoft: palette.charcoalSoft,

  text: palette.charcoal,
  textMuted: palette.mute500,
  textDim: palette.mute400,
  textOnDark: palette.creamSoft,
  textOnDarkMuted: palette.mute300,

  border: palette.mute200,
  borderStrong: palette.mute300,
  borderDark: palette.charcoalSoft,

  brand: palette.tomato,
  brandDark: palette.tomatoDark,
  brandOn: palette.creamSoft,
  accent: palette.ember,
  accentOn: palette.charcoal,
  secondary: palette.avocado,
  secondaryDark: palette.avocadoDark,

  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,

  warningBg: '#FCF3D7',
  warningText: '#7A5A00',

  // Exposed palette shortcuts (useful in gradients)
  creamSoft: palette.creamSoft,
  charcoalSoft: palette.charcoalSoft,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontFamilyWeb = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  display:
    "'Archivo', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

export const typeScale = {
  displayXl: 56,
  displayLg: 44,
  display: 36,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  micro: 11,
} as const;

export const shadowsWeb = {
  sm: '0 1px 2px rgba(26, 21, 18, 0.06), 0 1px 3px rgba(26, 21, 18, 0.08)',
  md: '0 4px 12px rgba(26, 21, 18, 0.08), 0 2px 4px rgba(26, 21, 18, 0.06)',
  lg: '0 12px 28px rgba(26, 21, 18, 0.12), 0 4px 10px rgba(26, 21, 18, 0.08)',
  glow: '0 10px 32px rgba(200, 16, 46, 0.25)',
} as const;

export const theme = {
  palette,
  colors,
  spacing,
  radius,
  fontFamilyWeb,
  typeScale,
  shadowsWeb,
};

export type Theme = typeof theme;
