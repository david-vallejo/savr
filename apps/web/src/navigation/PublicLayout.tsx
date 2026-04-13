import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/auth';
import { useCart } from '@app/data';
import { colors, radius, spacing, fontFamilyWeb } from '@app/config';
import { SavrLogo } from '@app/ui';
import { MockBanner } from '../components/MockBanner';

const LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/plans', label: 'Plans' },
];

export function PublicLayout() {
  const { user, isMockMode } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isMockMode && <MockBanner />}
      <header
        style={{
          position: 'sticky',
          top: isMockMode ? 26 : 0,
          zIndex: 20,
          backgroundColor: 'rgba(247, 241, 230, 0.88)',
          backdropFilter: 'saturate(180%) blur(12px)',
          WebkitBackdropFilter: 'saturate(180%) blur(12px)',
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
            gap: spacing.xl,
          }}
        >
          <Link to="/" style={{ display: 'inline-flex' }}>
            <SavrLogo size={24} />
          </Link>
          <nav
            style={{
              display: 'flex',
              gap: spacing.xl,
              fontFamily: fontFamilyWeb.sans,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                style={({ isActive }) => ({
                  color: isActive ? colors.brand : colors.text,
                  padding: `6px 2px`,
                  borderBottom: isActive ? `2px solid ${colors.brand}` : '2px solid transparent',
                })}
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? colors.brand : colors.text,
                  padding: `6px 2px`,
                  borderBottom: isActive ? `2px solid ${colors.brand}` : '2px solid transparent',
                })}
              >
                Dashboard
              </NavLink>
            ) : null}
          </nav>
          <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
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
              🛒 Cart
              {cartCount > 0 ? (
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
              ) : null}
            </button>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: colors.brand,
                  color: colors.brandOn,
                  border: 'none',
                  borderRadius: radius.pill,
                  padding: '8px 18px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Account
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: colors.brand,
                  color: colors.brandOn,
                  border: 'none',
                  borderRadius: radius.pill,
                  padding: '8px 18px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: `${spacing['2xl']}px ${spacing.xl}px`,
          backgroundColor: colors.bgInverse,
          color: colors.textOnDarkMuted,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <SavrLogo tone="light" />
          <div style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} Savr · Pre-order. Pay less. Eat better.
          </div>
        </div>
      </footer>
    </div>
  );
}
