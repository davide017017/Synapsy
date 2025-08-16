// src/navigation/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// React Navigation: AuthStack + AppTabs
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import Home from '../screens/Home';
import Transactions from '../screens/Transactions';
import Categories from '../screens/Categories';
import Profile from '../screens/Profile';
import Login from '../screens/Login';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
