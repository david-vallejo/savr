import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@app/config';
import { MenuScreen } from '../screens/Menu';
import { MealDetailScreen } from '../screens/MealDetail';
import { CartScreen } from '../screens/Cart';
import { BotScreen } from '../screens/Bot';
import { OrdersScreen } from '../screens/Orders';
import { DashboardScreen } from '../screens/Dashboard';
import { ProfileScreen } from '../screens/Profile';
import { SettingsScreen } from '../screens/Settings';
import { WalletScreen } from '../screens/Wallet';
import { PlansScreen } from '../screens/Plans';

export type MenuStackParamList = {
  MenuList: undefined;
  MealDetail: { id: string };
};

export type YouStackParamList = {
  Profile: undefined;
  Wallet: undefined;
  Plans: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator();
const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const YouStack = createNativeStackNavigator<YouStackParamList>();

function MenuStackNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuList" component={MenuScreen} />
      <MenuStack.Screen name="MealDetail" component={MealDetailScreen} />
    </MenuStack.Navigator>
  );
}

function YouStackNavigator() {
  return (
    <YouStack.Navigator screenOptions={{ headerShown: false }}>
      <YouStack.Screen name="Profile" component={ProfileScreen} />
      <YouStack.Screen name="Wallet" component={WalletScreen} />
      <YouStack.Screen name="Plans" component={PlansScreen} />
      <YouStack.Screen name="Settings" component={SettingsScreen} />
    </YouStack.Navigator>
  );
}

function tabIcon(label: string) {
  return ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{label}</Text>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.bgPaper,
          height: 72,
          paddingTop: 6,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Menu" component={MenuStackNavigator} options={{ tabBarIcon: tabIcon('🍱') }} />
      <Tab.Screen name="SavrBot" component={BotScreen} options={{ tabBarIcon: tabIcon('🤖') }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: tabIcon('🛒') }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarIcon: tabIcon('📦') }} />
      <Tab.Screen name="You" component={YouStackNavigator} options={{ tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}
