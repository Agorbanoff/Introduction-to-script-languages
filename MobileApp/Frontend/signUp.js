import React, { useState } from 'react';
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setAccessToken } from './authManager';

const SignUpPage = ({ navigation }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });

  const validateInputs = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '' };

    if (form.username.trim().length < 2 || form.username.length > 30) {
      newErrors.username = 'Username must be between 2 and 30 characters.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }

    if (form.password.length < 6 || form.password.length > 50) {
      newErrors.password = 'Password must be between 6 and 50 characters.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch('https://gymax.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('❌ Invalid JSON from backend:', err);
        Alert.alert('Error', 'Server returned invalid response');
        return;
      }

      if (response.ok && data.access_token && data.refresh_token) {
        await SecureStore.setItemAsync('refresh_token', data.refresh_token);
        setAccessToken(data.access_token);

        // Optional: small delay to make sure RAM token is set before navigating
        setTimeout(() => {
          navigation.navigate('statistics');
        }, 100);
      } else {
        Alert.alert('Error', data?.detail || data?.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
                style={[styles.input, errors.username && styles.inputError]}
                placeholder={errors.username || 'Enter a username'}
                value={form.username}
                onChangeText={(text) => updateField('username', text)}
                placeholderTextColor={errors.username ? 'red' : '#888'}
              />

              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder={errors.email || 'Enter your email'}
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                placeholderTextColor={errors.email ? 'red' : '#888'}
                keyboardType="email-address"
              />

              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder={errors.password || 'Enter a password'}
                secureTextEntry={true}
                value={form.password}
                onChangeText={(text) => updateField('password', text)}
                placeholderTextColor={errors.password ? 'red' : '#888'}
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
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
