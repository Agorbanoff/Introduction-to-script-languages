// ChangeCredentialsPage.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ChangeCredentialsPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { mode } = route.params; // "username" or "password"

  // form state
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword]   = useState('');
  const [newPassword, setNewPassword]   = useState('');

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Not authenticated.');
      return;
    }

    let url;
    let payload = {};
    let method = mode === 'username' ? 'PUT' : 'POST';

    if (mode === 'username') {
      if (!newUsername.trim()) {
        Alert.alert('Error', 'Please enter a new username.');
        return;
      }
      url = 'https://gymax.onrender.com/auth/changeusername';
      payload = { new_username: newUsername.trim() };
    } else {
      if (!oldPassword || !newPassword) {
        Alert.alert('Error', 'Please enter both current and new password.');
        return;
      }
      url = 'https://gymax.onrender.com/auth/changepassword';
      payload = { old_password: oldPassword, new_password: newPassword };
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert(
          'Success',
          mode === 'username' ? 'Username updated!' : 'Password changed!'
        );
        navigation.goBack();
      } else {
        // build a user-friendly error message
        let errorMessage = 'Update failed';
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => err.msg || JSON.stringify(err)).join('\n');
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        }
        Alert.alert('Error', errorMessage);
      }
    } catch (err) {
      console.error('Network error:', err);
      Alert.alert('Error', 'Network error, please try again.');
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
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.overlay}>
            <Text style={styles.title}>
              {mode === 'username' ? 'Change Username' : 'Change Password'}
            </Text>

            <View style={styles.form}>
              {mode === 'username' ? (
                <TextInput
                  style={styles.input}
                  placeholder="New Username"
                  placeholderTextColor="#aaa"
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
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
            </View>

            <StatusBar style="auto" />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33,33,33,0.85)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1db344',
    marginBottom: 30,
  },
  form: {
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 44,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#1db344',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
