import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function LogInPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch('https://gymax.onrender.com/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ Response not JSON:', text);
        Alert.alert('Error', 'Invalid server response.');
        return;
      }

      console.log('Login response:', data);

      if (response.ok && data.access_token) {
        console.log('✅ Token:', data.access_token);

        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('email', email);

        const trainingResponse = await fetch('https://gymax.onrender.com/stats/training', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        if (trainingResponse.ok) {
          const trainingData = await trainingResponse.json();
          console.log('Training info:', trainingData);

          const sessions = trainingData.sessions_per_week;
          await AsyncStorage.setItem('sessionsPerWeek', sessions.toString());

          navigation.navigate('gym', { sessionsPerWeek: sessions });
        } else {
          console.log('⚠️ No training data found, redirecting to StatusPage');
          navigation.navigate('status');
        }
      } else {
        setEmailError('');
        setPasswordError('');

        if (data.detail) {
          const errorMsg = data.detail.toLowerCase();

          if (errorMsg.includes('email')) {
            setEmailError('Invalid email');
          } else if (errorMsg.includes('password')) {
            setPasswordError('Invalid password');
          } else if (errorMsg.includes('credentials')) {
            setEmailError('Invalid credentials');
            setPasswordError('Invalid credentials');
          } else {
            Alert.alert('Error', data.detail);
          }
        } else if (data.message) {
          Alert.alert('Error', data.message);
        } else {
          Alert.alert('Error', 'Login failed');
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      Alert.alert('Error', 'Network or server error');
    }
  };

  return (
    <ImageBackground
      source={require('./Images/gymPhoto.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <SafeAreaView>
              <Text style={styles.frontText}>Welcome Back!</Text>
            </SafeAreaView>

            <View style={styles.container}>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder={emailError ? emailError : 'Enter your email'}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholderTextColor={emailError ? 'red' : '#888'}
                keyboardType="email-address"
              />

              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder={passwordError ? passwordError : 'Enter your password'}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                placeholderTextColor={passwordError ? 'red' : '#888'}
              />

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('signup')}
                >
                  <Text style={styles.buttonText}>Don't have an account?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <StatusBar style="auto" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.9)', // darker background
    justifyContent: 'center',
  },
  frontText: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1db344',
    padding: 30,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '20%',
  },
  input: {
    height: 45,
    width: '80%',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15, 
    paddingHorizontal: 10,
    backgroundColor: '#111', 
    color: 'white',
  },
  inputError: {
    borderColor: 'red', 
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1db344',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
