import React, { useState } from 'react';
import {
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_API } from './apiConfig';
import { authFetch } from './authFetch';
import { ensureAccessToken } from './authManager';
import { getApiErrorMessage, parseApiResponse } from './apiResponse';
import FuturisticBackdrop from './FuturisticBackdrop';

export default function ChangeCredentialsPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { mode } = route.params;

  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    const token = await ensureAccessToken();
    if (!token) {
      setErrorMessage('Not authenticated.');
      return;
    }

    let url;
    let payload = {};
    const method = 'PUT';

    if (mode === 'username') {
      if (!newUsername.trim() || !oldPassword) {
        setErrorMessage('Please enter your current password and a new username.');
        return;
      }
      url = `${BASE_API}/auth/changeusername`;
      payload = {
        new_username: newUsername.trim(),
        current_password: oldPassword,
      };
    } else {
      if (!oldPassword || !newPassword) {
        setErrorMessage('Please enter both current and new password.');
        return;
      }
      url = `${BASE_API}/auth/changepassword`;
      payload = {
        current_password: oldPassword,
        new_password: newPassword,
      };
    }

    try {
      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await parseApiResponse(res);

      if (res.ok) {
        setSuccessMessage(mode === 'username' ? 'Username updated successfully!' : 'Password changed successfully!');
        setErrorMessage('');
        setNewUsername('');
        setOldPassword('');
        setNewPassword('');
      } else {
        setSuccessMessage('');
        setErrorMessage(getApiErrorMessage(data, 'Update failed'));
      }
    } catch (err) {
      console.error('Network error:', err);
      setSuccessMessage('');
      setErrorMessage('Network error, please try again.');
    }
  };

  return (
    <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.overlay}>
            <Text style={styles.title}>
              {mode === 'username' ? 'Change Username' : 'Change Password'}
            </Text>
            <Text style={styles.captionText}>
              Update your account details inside the same futuristic visual system.
            </Text>

            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.form}>
              {mode === 'username' ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New Username"
                    placeholderTextColor="#aaa"
                    value={newUsername}
                    onChangeText={setNewUsername}
                  />
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                  {mode === 'username' ? 'Update Username' : 'Update Password'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back to Settings</Text>
              </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </FuturisticBackdrop>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1db344',
    marginBottom: 20,
  },
  captionText: {
    textAlign: 'center',
    color: 'rgba(214, 229, 224, 0.74)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  form: {
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    marginBottom: 15,
  },
  button: {
    width: '80%',
    backgroundColor: '#6ff7c7',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#071611',
    fontSize: 16,
    fontWeight: '800',
  },
  backButton: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backButtonText: {
    color: '#f7fffb',
    fontSize: 16,
    fontWeight: '700',
  },
  successText: {
    color: 'lightgreen',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
});
