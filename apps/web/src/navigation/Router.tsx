import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@app/auth';
import { colors } from '@app/config';
import { ProtectedLayout } from './ProtectedLayout';
import { PublicLayout } from './PublicLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Menu } from '../pages/Menu';
import { MealDetail } from '../pages/MealDetail';
import { Cart } from '../pages/Cart';
import { Plans } from '../pages/Plans';
import { Dashboard } from '../pages/Dashboard';
import { Wallet } from '../pages/Wallet';
import { Bot } from '../pages/Bot';
import { Orders } from '../pages/Orders';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';

export function Router() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textMuted,
          fontSize: 14,
        }}
      >
        Loading Savr…
      </div>
    );
  }

  return (
    <Routes>
      {/* Public marketing + browse */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MealDetail />} />
        <Route path="/plans" element={<Plans />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Authenticated app shell */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bot" element={<Bot />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
