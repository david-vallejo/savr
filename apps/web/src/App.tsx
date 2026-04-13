import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@app/auth';
import { Router } from './navigation/Router';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export function App() {
  return (
    <BrowserRouter basename={basename || undefined}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}
