import React, { useState } from 'react';
import { BASE_API } from './apiConfig';
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
  Image,
} from 'react-native';
import FuturisticBackdrop from './FuturisticBackdrop';

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
      const response = await fetch(`${BASE_API}/auth/signup`, {
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

      if (response.ok) {
        navigation.replace('login', {
          email: form.email,
          password: form.password,
        });
        return;
      }

      let data = null;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Invalid signup error response:', err);
      }

      Alert.alert('Error', data?.detail || data?.message || 'Registration failed.');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
              <Text style={styles.frontText}>
                Welcome to our app{'\n'}Make an account and get shredded!
              </Text>
              <Text style={styles.captionText}>
                Create your account first, then log in to start your Gymax journey.
              </Text>
            </SafeAreaView>

            <View style={styles.container}>
              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Enter a username"
                  value={form.username}
                  onChangeText={(text) => updateField('username', text)}
                  placeholderTextColor="#8a9794"
                />
                <Text style={[styles.helperText, errors.username && styles.errorText]}>
                  {errors.username || 'Use 2 to 30 characters for your username.'}
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={form.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholderTextColor="#8a9794"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={[styles.helperText, errors.email && styles.errorText]}>
                  {errors.email || 'Use a valid email address you can log in with.'}
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter a password"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(text) => updateField('password', text)}
                  placeholderTextColor="#8a9794"
                />
                <Text style={[styles.helperText, errors.password && styles.errorText]}>
                  {errors.password || 'Choose a password between 6 and 50 characters.'}
                </Text>
              </View>

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('login')}
                >
                  <Text style={styles.secondaryButtonText}>Already have an account?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </FuturisticBackdrop>
  );
};

export default SignUpPage;

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
    fontSize: 32,
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
  fieldGroup: {
    width: '80%',
    marginBottom: 12,
  },
  input: {
    height: 48,
    width: '100%',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: 'white',
  },
  inputError: {
    borderColor: '#ff7f78',
    backgroundColor: 'rgba(255, 127, 120, 0.08)',
  },
  helperText: {
    color: 'rgba(214, 229, 224, 0.58)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    paddingHorizontal: 6,
    minHeight: 34,
  },
  errorText: {
    color: '#ff9f99',
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
