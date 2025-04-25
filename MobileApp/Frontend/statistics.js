import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';

export default function StatisticsPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      // 1) get token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      // 2) fetch profile
      try {
        const res = await fetch('https://gymax.onrender.com/auth/getusername', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const { username: nameFromServer } = await res.json();
        setUsername(nameFromServer);
      } catch (err) {
        console.error('Profile fetch error:', err);
        Alert.alert('Error', 'Could not load user info.');
      }
    };

    bootstrap();
  }, []);
  // Get user email from AsyncStorage
  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) setUserEmail(storedEmail);
    };
    getEmail();
  }, []);

  const handleSubmit = async () => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const normalizedGender = gender.toLowerCase().trim();

    if (
      !gender ||
      isNaN(w) || w <= 0 || w >= 400 ||
      isNaN(h) || h <= 50 || h >= 300 ||
      isNaN(a) || a < 5 || a > 120
    ) {
      Alert.alert('Validation Error', 'Please fill all fields with valid values.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('User not authenticated.');
        return;
      }

      console.log("Submitting stats:", {
        gender: normalizedGender,
        weight: w,
        height: h,
        age: a
      });

      const response = await fetch('https://gymax.onrender.com/stats/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender: normalizedGender,
          weight: w,
          height: h,
          age: a,
        }),
      });

      const data = await response.json();
      console.log('Statistics response:', data);

      if (response.ok) {
        navigation.navigate('status');
      } else {
        Alert.alert('Error', data.message || 'Failed to save statistics');
      }
    } catch (error) {
      console.error('Error submitting stats:', error);
      Alert.alert('Error', 'Network error while sending statistics');
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
              {`Hello, ${username || 'there'}!`}{'\n'}
              Let's gather some statistics about you!
              </Text>
            </SafeAreaView>

            <View style={styles.container}>
              <Text style={styles.label}>Select your gender:</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'male' && styles.genderButtonTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.genderButtonTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>

              {gender ? (
                <Text style={styles.selectedGenderText}>
                  Selected: {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Enter your height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholderTextColor="#aaa"
              />

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
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
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '20%',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  genderButton: {
    backgroundColor: '#333',
    borderColor: '#1db344',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  genderButtonSelected: {
    backgroundColor: '#1db344',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderButtonTextSelected: {
    color: '#000',
  },
  selectedGenderText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
