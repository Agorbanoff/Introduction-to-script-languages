import React, { useState } from 'react';
import { Alert } from 'react-native'; 
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

  const handleSignUp = async () => {
    console.log('🚀 Sign Up button pressed');
    try {
      const response = await fetch('https://gymax.onrender.com/signup', {
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
  
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log(response);
      if (response.ok) {
        console.log('Success:', data);
        navigation.navigate('statistics'); // move to next screen
      } else {
        console.error('Failed:', data);
        Alert.alert('Error', data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
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
                style={styles.input}
                placeholder="Enter an username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter an email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter a password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#aaa"
              />

              <View style={styles.buttonColumn}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignUp}

                >
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
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
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
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    color: 'white',
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