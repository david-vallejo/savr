import { User } from './types';

const MOCK_CREDENTIALS = { email: 'user', password: 'password' };

const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'user@mock.local',
};

export function mockLogin(
  email: string,
  password: string
): { user: User | null; error: string | null } {
  if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
    return { user: MOCK_USER, error: null };
  }
  return {
    user: null,
    error: 'Invalid credentials. In mock mode, use "user" / "password".',
  };
}

export function mockSignup(): { user: User | null; error: string | null } {
  return {
    user: null,
    error: 'Signup is disabled in mock mode. Use "user" / "password" to log in.',
  };
}
