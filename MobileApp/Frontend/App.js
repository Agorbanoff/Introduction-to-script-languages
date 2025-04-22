import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';
import StatusPage from './status';
import SettingsPage from './settings';
import GymPage from './gym';
import DietPage from './diet';
import WorkoutPage from './workout';
import RecipePage from './recipe';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setInitialRoute('login');
        return;
      }

      try {
        const res = await fetch('https://gymax.onrender.com/stats/training', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          await AsyncStorage.setItem('sessionsPerWeek', data.sessions_per_week.toString());
          setInitialRoute('gym');
        } else {
          setInitialRoute('status'); // No training info yet
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
        setInitialRoute('login');
      }
    };

    checkLogin();
  }, []);

  if (!initialRoute) return null; // You can show a loading screen here

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="signup" component={SignUpPage} options={{ headerShown: false }} />
        <Stack.Screen name="statistics" component={StatisticsPage} options={{ headerShown: false }} />
        <Stack.Screen name="status" component={StatusPage} options={{ headerShown: false }} />
        <Stack.Screen name="settings" component={SettingsPage} options={{ headerShown: false }} />
        <Stack.Screen name="diet" component={DietPage} options={{ headerShown: false }} />
        <Stack.Screen name="gym" component={GymPage} options={{ headerShown: false }} />
        <Stack.Screen name="workout" component={WorkoutPage} options={{ headerShown: false }} />
        <Stack.Screen name="recipe" component={RecipePage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
