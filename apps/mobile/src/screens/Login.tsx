import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@app/auth';
import { Button, Card, Input, SavrLogo } from '@app/ui';
import { APP_NAME, colors, spacing } from '@app/config';
import { MockBanner } from '../components/MockBanner';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const { login, signup, isMockMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const action = isSignup ? signup : login;
    const result = await action(email, password);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    }
    // on success, AuthProvider triggers the tab navigator automatically
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {isMockMode && <MockBanner />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
          <SavrLogo size={20} />
        </View>
        <View style={styles.body}>
          <Text style={styles.headline}>
            Your week of meals, <Text style={{ color: colors.brand }}>already handled.</Text>
          </Text>
          <Text style={styles.sub}>
            Sign in to unlock pre-order discounts, wallet credit, SavrBot planning and one-tap reorders.
          </Text>

          <Card>
            <Text style={styles.formTitle}>
              {isSignup ? 'Create your account' : `Welcome back to ${APP_NAME}`}
            </Text>
            <View style={styles.formFields}>
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
                label={submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
                size="lg"
                fullWidth
                onPress={handleSubmit}
                disabled={submitting}
              />
              <Pressable onPress={() => { setIsSignup(!isSignup); setError(null); }}>
                <Text style={styles.toggle}>
                  {isSignup ? 'Already have an account?' : 'New to Savr?'}{' '}
                  <Text style={styles.toggleLink}>{isSignup ? 'Log in' : 'Sign up'}</Text>
                </Text>
              </Pressable>
              {isMockMode && (
                <View style={styles.hint}>
                  <Text style={styles.hintText}>
                    🧪 Mock mode · use <Text style={{ fontWeight: '800' }}>user</Text> /{' '}
                    <Text style={{ fontWeight: '800' }}>password</Text>
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  back: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  body: { flex: 1, padding: spacing.lg, gap: spacing.lg, justifyContent: 'center' },
  headline: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
    lineHeight: 38,
  },
  sub: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  formTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  formFields: { marginTop: spacing.md, gap: spacing.md },
  toggle: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  toggleLink: { color: colors.brand, fontWeight: '800' },
  hint: {
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: 10,
  },
  hintText: { color: colors.warningText, fontSize: 12, textAlign: 'center' },
});
