import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';
import StatusPage from './status';
import SettingsPage from './settings';
import AllergensPage from './allergens';
import GymPage from './gym';
import DietPage from './diet';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="signup">
        <Stack.Screen name="login" component={LoginPage} options={{ title: 'Log in', headerShown: false }} />
        <Stack.Screen name="signup" component={SignUpPage} options={{ title: 'Sign up', headerShown: false }} />
        <Stack.Screen name="statistics" component={StatisticsPage} options={{ title: 'Statistics', headerShown: false }} />
        <Stack.Screen name="status" component={StatusPage} options={{ title: 'Status', headerShown: false }} />
        <Stack.Screen name="settings" component={SettingsPage} options={{ title: 'Settings', headerShown: false }} />
        <Stack.Screen name='allergens' component={AllergensPage} options={{ title: 'Allergens', headerShown: false }} />
        <Stack.Screen name="diet" component={DietPage} options={{ title: 'Diet', headerShown: false }} />
        <Stack.Screen name="gym" component={GymPage} options={{ title: 'Gym', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
