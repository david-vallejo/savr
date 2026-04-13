import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@app/auth';
import { Router } from './navigation/Router';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}
