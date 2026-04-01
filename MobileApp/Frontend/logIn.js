import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { authFetch } from './authFetch';
import { storeAuthTokens } from './authManager';
import { BASE_API } from './apiConfig';
import { getApiErrorMessage, parseApiResponse } from './apiResponse';
import FuturisticBackdrop from './FuturisticBackdrop';

export default function LogInPage({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [password, setPassword] = useState(route?.params?.password ?? '');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Invalid password');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${BASE_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await parseApiResponse(response);

      if (response.ok && data.access_token && data.refresh_token) {
        await storeAuthTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        const statisticsResponse = await authFetch(`${BASE_API}/stats/statistics`, {
          method: 'GET',
        });

        if (
          statisticsResponse.status === 404 ||
          statisticsResponse.status === 400 ||
          statisticsResponse.status === 422
        ) {
          navigation.replace('statistics');
          return;
        }

        if (!statisticsResponse.ok) {
          Alert.alert('Error', 'Could not load your statistics.');
          return;
        }

        const trainingResponse = await authFetch(`${BASE_API}/stats/training`, {
          method: 'GET',
        });

        if (trainingResponse.ok) {
          const trainingData = await parseApiResponse(trainingResponse);
          const sessions = trainingData.sessions_per_week;
          if (typeof sessions === 'number') {
            await AsyncStorage.setItem('sessionsPerWeek', String(sessions));
            navigation.navigate('gym', { sessionsPerWeek: sessions });
            return;
          }
          navigation.navigate('status');
        } else {
          navigation.navigate('status');
        }
      } else {
        setEmailError('');
        setPasswordError('');

        const errorMsg = getApiErrorMessage(data, 'Login failed').toLowerCase();
        if (errorMsg.includes('email')) {
          setEmailError('Invalid email');
        } else if (errorMsg.includes('password')) {
          setPasswordError('Invalid password');
        } else if (errorMsg.includes('credentials')) {
          setEmailError('Invalid credentials');
          setPasswordError('Invalid credentials');
        } else {
          Alert.alert('Error', getApiErrorMessage(data, 'Login failed'));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network or server error');
    }
  };

  return (
    <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <SafeAreaView>
              <Image
                source={require('./Images/gymax_logo.png')}
                style={styles.brandLogo}
              />
              <Text style={styles.frontText}>Welcome Back!</Text>
              <Text style={styles.captionText}>
                Log in here to generate your tokens and continue with your plan.
              </Text>
            </SafeAreaView>

            <View style={styles.container}>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder={emailError || 'Enter your email'}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholderTextColor={emailError ? '#ff9f99' : '#888'}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder={passwordError || 'Enter your password'}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                placeholderTextColor={passwordError ? '#ff9f99' : '#888'}
              />

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('signup')}
                >
                  <Text style={styles.secondaryButtonText}>Don't have an account?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <StatusBar style="auto" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </FuturisticBackdrop>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  brandLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(157, 255, 224, 0.35)',
    backgroundColor: 'rgba(8, 16, 14, 0.46)',
  },
  frontText: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: '800',
    color: '#9dffe0',
    paddingHorizontal: 30,
  },
  captionText: {
    textAlign: 'center',
    color: 'rgba(214, 229, 224, 0.74)',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 34,
    marginTop: 6,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '20%',
  },
  input: {
    height: 48,
    width: '80%',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 15,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: 'white',
  },
  inputError: {
    borderColor: '#ff7f78',
    backgroundColor: 'rgba(255, 127, 120, 0.08)',
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6ff7c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#071611',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryButtonText: {
    color: '#ecfff8',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
});
