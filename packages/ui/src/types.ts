import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
  leftAction?: {
    label: string;
    onPress: () => void;
  };
  transparent?: boolean;
}

export interface LayoutProps {
  children: ReactNode;
  maxWidth?: number;
  padded?: boolean;
}

export interface NavigationItem {
  label: string;
  onPress: () => void;
  active?: boolean;
  badge?: string | number;
}

export interface NavigationBarProps {
  items: NavigationItem[];
}

export type BadgeTone = 'brand' | 'accent' | 'success' | 'warn' | 'neutral' | 'inverse';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
}

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  padded?: boolean;
  tone?: 'default' | 'inverse' | 'accent';
  style?: Record<string, unknown>;
}

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leadingIcon?: ReactNode;
}

export interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  autoFocus?: boolean;
  error?: string;
  multiline?: boolean;
}

export interface PriceTagProps {
  cents: number;
  originalCents?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'accent';
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  body?: string;
  cta?: { label: string; onPress: () => void };
}

export interface LogoProps {
  size?: number;
  tone?: 'light' | 'dark';
}
