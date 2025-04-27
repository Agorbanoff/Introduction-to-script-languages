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

export default function SignUpPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let valid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (username.length < 2 || username.length > 30) {
      setUsernameError('Username must be between 2 and 30');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (password.length < 6 || password.length > 50) {
      setPasswordError('Password must be at least 6');
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async () => {
    console.log('🚀 Sign Up button pressed');

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch('https://gymax.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
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
        Alert.alert('Error', 'Server returned invalid response.');
        return;
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok && data.access_token) {
        console.log('✅ Token received:', data.access_token);
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('email', email);
        navigation.navigate('statistics');
      } else {
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        if (data.detail) {
          const errorMsg = data.detail.toLowerCase();

          if (errorMsg.includes('email')) {
            setEmailError('Email already registered');
          } else if (errorMsg.includes('username')) {
            setUsernameError('Invalid username');
          } else if (errorMsg.includes('password')) {
            setPasswordError('Invalid password');
          } else {
            Alert.alert('Error', data.detail);
          }
        } else if (data.message) {
          const errorMsg = data.message.toLowerCase();

          if (errorMsg.includes('email')) {
            setEmailError('Email already registered');
          } else if (errorMsg.includes('username')) {
            setUsernameError('Invalid username');
          } else if (errorMsg.includes('password')) {
            setPasswordError('Invalid password');
          } else {
            Alert.alert('Error', data.message);
          }
        } else {
          Alert.alert('Error', 'Registration failed');
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
              <Text style={styles.frontText}>
                Welcome to our app{'\n'} Make an account and get shredded!
              </Text>
            </SafeAreaView>

            <View style={styles.container}>
              <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                placeholder={usernameError ? usernameError : 'Enter a username'}
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={usernameError ? 'red' : '#888'}
              />

              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder={emailError ? emailError : 'Enter your email'}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={emailError ? 'red' : '#888'}
                keyboardType="email-address"
              />

              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder={passwordError ? passwordError : 'Enter a password'}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={passwordError ? 'red' : '#888'}
              />

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('login')}
                >
                  <Text style={styles.buttonText}>Already have an account?</Text>
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
    backgroundColor: 'rgba(20, 20, 20, 0.9)', // darker overlay
    justifyContent: 'center',
  },
  frontText: {
    textAlign: 'center',
    fontSize: 30,
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
    borderColor: '#555',  // darker border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15, // small margin, not big padding
    paddingHorizontal: 10,
    backgroundColor: '#111',  // darker input background
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
