import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAuth } from '@app/auth';
import { colors } from '@app/config';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

const NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgPaper,
    text: colors.text,
    border: colors.border,
    primary: colors.brand,
    notification: colors.brand,
  },
};

export function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={NAV_THEME}>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
