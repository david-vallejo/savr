import React from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/auth';
import { useCart, usePrefs } from '@app/data';
import { SavrLogo } from '@app/ui';
import { colors, radius, spacing } from '@app/config';
import { MockBanner } from '../components/MockBanner';

const NAV = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/menu', label: 'Menu', icon: '🍱' },
  { to: '/bot', label: 'SavrBot', icon: '🤖' },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/wallet', label: 'Wallet', icon: '💰' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function ProtectedLayout() {
  const { user, logout, isMockMode } = useAuth();
  const cart = useCart();
  const prefs = usePrefs();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isMockMode && <MockBanner />}
      <header
        style={{
          position: 'sticky',
          top: isMockMode ? 26 : 0,
          zIndex: 20,
          backgroundColor: 'rgba(247, 241, 230, 0.9)',
          backdropFilter: 'saturate(180%) blur(12px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: `${spacing.md}px ${spacing.xl}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <SavrLogo size={22} />
            </button>
            <div style={{ fontSize: 13, color: colors.textMuted }}>
              Hey, <strong style={{ color: colors.text }}>{prefs.displayName || user.email.split('@')[0]}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/cart')}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.pill,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: colors.text,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              🛒
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: colors.brand,
                    color: colors.brandOn,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.pill,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <nav
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: `0 ${spacing.xl}px ${spacing.sm}px`,
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
          }}
        >
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                padding: '8px 14px',
                borderRadius: radius.pill,
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: isActive ? colors.bgInverse : 'transparent',
                color: isActive ? colors.textOnDark : colors.text,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              })}
            >
              <span>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
