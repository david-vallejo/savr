import React from 'react';
import { spacing } from '@app/config';
import { LayoutProps } from './types';

export function Layout({ children, maxWidth = 1120, padded = true }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        padding: padded ? `${spacing['2xl']}px ${spacing.xl}px` : 0,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
