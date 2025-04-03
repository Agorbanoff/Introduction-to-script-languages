import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';
import StatusPage from './status';
import HomePage from './home';
import SettingsPage from './settings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="signup">
        <Stack.Screen name="login" component={LoginPage} options={{ title: 'Log in', headerShown: false }} />
        <Stack.Screen name="signup" component={SignUpPage} options={{ title: 'Sign up', headerShown: false }} />
        <Stack.Screen name="statistics" component={StatisticsPage} options={{ title: 'Statistics', headerShown: false }} />
        <Stack.Screen name="status" component={StatusPage} options={{ title: 'Status', headerShown: false }} />
        <Stack.Screen name="home" component={HomePage} options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="settings" component={SettingsPage} options={{ title: 'Settings', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
