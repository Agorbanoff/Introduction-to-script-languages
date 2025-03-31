import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={LoginPage} options={{ title: 'Log in', headerShown: false }} />
        <Stack.Screen name="signup" component={SignUpPage} options={{ title: 'Sign up', headerShown: false }} />
        <Stack.Screen name="statistics" component={StatisticsPage} options={{ title: 'Statistics', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
