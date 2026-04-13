import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@app/auth';
import { Button, Card, Input, SavrLogo } from '@app/ui';
import { colors, fontFamilyWeb, spacing } from '@app/config';
import { MockBanner } from '../components/MockBanner';

export function Login() {
  const { login, signup, isMockMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const action = isSignup ? signup : login;
    const result = await action(email, password);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isMockMode && <MockBanner />}
      <div style={{ padding: spacing.lg }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← Back to home
        </button>
      </div>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          alignItems: 'center',
          gap: spacing['3xl'],
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: spacing.xl,
        }}
      >
        <div>
          <SavrLogo size={32} />
          <h1
            style={{
              fontFamily: fontFamilyWeb.display,
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: -1.2,
              marginTop: spacing.lg,
              lineHeight: 1.05,
            }}
          >
            Your week of meals,{' '}
            <span style={{ color: colors.brand }}>already handled.</span>
          </h1>
          <p style={{ color: colors.textMuted, marginTop: spacing.md, maxWidth: 480, fontSize: 16 }}>
            Sign in to unlock pre-order discounts, wallet credit, SavrBot planning, and one-tap
            reorders.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: fontFamilyWeb.display }}>
              {isSignup ? 'Create your Savr account' : 'Welcome back'}
            </h2>
            <Input
              label={isMockMode ? 'Username' : 'Email'}
              value={email}
              onChange={setEmail}
              placeholder={isMockMode ? 'user' : 'you@example.com'}
              type={isMockMode ? 'text' : 'email'}
            />
            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder={isMockMode ? 'password' : 'Your password'}
              type="password"
              error={error ?? undefined}
            />
            <Button
              type="submit"
              fullWidth
              size="lg"
              label={submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
              onPress={() => {}}
              disabled={submitting}
            />
            <p style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>
              {isSignup ? 'Already have an account?' : 'New to Savr?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.brand,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
            {isMockMode && (
              <div
                style={{
                  fontSize: 13,
                  color: colors.warningText,
                  backgroundColor: colors.warningBg,
                  padding: '10px 14px',
                  borderRadius: 10,
                }}
              >
                🧪 Mock mode: use <strong>user</strong> / <strong>password</strong> to log in.
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
