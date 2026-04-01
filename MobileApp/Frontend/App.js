import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API } from "./apiConfig";
import { authFetch } from './authFetch';
import { clearTokens, ensureAccessToken } from './authManager';
import { parseApiResponse } from './apiResponse';
import LoginPage from './logIn';
import SignUpPage from './signUp';
import StatisticsPage from './statistics';
import StatusPage from './status';
import SettingsPage from './settings';
import GymPage from './gym';
import DietPage from './diet';
import WorkoutPage from './WorkoutModern';
import RecipePage from './RecipeModern';
import ChangeCredentialsPage from './changeCredentials';
import CalorieInputPage from './CalorieInputModern';
import AiFetchPage from './aiFetch';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await ensureAccessToken();
      if (!token) {
        setInitialRoute('signup');
        return;
      }

      try {
        const statsRes = await authFetch(`${BASE_API}/stats/statistics`, {
          method: 'GET',
        });

        if (statsRes.status === 404 || statsRes.status === 400 || statsRes.status === 422) {
          setInitialRoute('statistics');
          return;
        }

        if (!statsRes.ok) {
          throw new Error(`Unexpected statistics state (${statsRes.status})`);
        }

        const trainingRes = await authFetch(`${BASE_API}/stats/training`, {
          method: 'GET',
        });

        if (trainingRes.ok) {
          const data = await parseApiResponse(trainingRes);
          if (data.sessions_per_week) {
            await AsyncStorage.setItem('sessionsPerWeek', data.sessions_per_week.toString());
            setInitialRoute('gym');
          } else {
            setInitialRoute('status');
          }
        } else if (trainingRes.status === 404 || trainingRes.status === 422) {
          setInitialRoute('status');
        } else {
          throw new Error(`Unexpected training state (${trainingRes.status})`);
        }
      } catch (error) {
        console.error('❌ Redirecting to signup. Reason:', error.message);

        await clearTokens();
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('sessionsPerWeek');

        setInitialRoute('signup');
      }
    };

    checkLogin();
  }, []);

  if (!initialRoute) return null; // Optional loading screen here

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
        <Stack.Screen name="changecredentials" component={ChangeCredentialsPage} options={{ headerShown: false }} />
        <Stack.Screen name="calorieinput" component={CalorieInputPage} options={{ headerShown: false }} />
        <Stack.Screen name="aiFetch" component={AiFetchPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
