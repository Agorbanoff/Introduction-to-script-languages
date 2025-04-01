import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';
import StatusPage from './status';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="signup">
        <Stack.Screen name="login" component={LoginPage} options={{ title: 'Log in', headerShown: false }} />
        <Stack.Screen name="signup" component={SignUpPage} options={{ title: 'Sign up', headerShown: false }} />
        <Stack.Screen name="statistics" component={StatisticsPage} options={{ title: 'Statistics', headerShown: false }} />
        <Stack.Screen name="status" component={StatusPage} options={{ title: 'Status', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
