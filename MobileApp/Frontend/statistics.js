import React, { useState, useEffect } from 'react';
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
import { authFetch } from './authFetch';

export default function StatisticsPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const [genderError, setGenderError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await authFetch('https://gymax.onrender.com/auth/getusername', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to load profile');

        const { username: nameFromServer } = await res.json();
        setUsername(nameFromServer);
      } catch (err) {
        console.error('Profile fetch error:', err);
        Alert.alert('Error', 'User not authenticated.');
      }
    };

    fetchUsername();
  }, []);

  const handleSubmit = async () => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const normalizedGender = gender.toLowerCase().trim();

    let valid = true;
    setGenderError('');
    setHeightError('');
    setWeightError('');
    setAgeError('');

    if (!normalizedGender || (normalizedGender !== 'male' && normalizedGender !== 'female')) {
      setGenderError('Select male or female');
      valid = false;
    }
    if (isNaN(h) || h <= 50 || h >= 300) {
      setHeightError('Enter your legit height');
      valid = false;
    }
    if (isNaN(w) || w <= 0 || w >= 400) {
      setWeightError('Enter your legit weight');
      valid = false;
    }
    if (isNaN(a) || a < 5 || a > 120) {
      setAgeError('Enter your legit age');
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await authFetch('https://gymax.onrender.com/stats/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          gender: normalizedGender,
          weight: w,
          height: h,
          age: a,
        }),
      });

      const data = await res.json();
      console.log('Statistics response:', data);

      if (res.ok) {
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
                {`Hello, ${username || 'there'}!`}{'\n'}Let's gather some statistics about you!
              </Text>
            </SafeAreaView>

            <View style={styles.container}>
              <Text style={styles.label}>Select your gender:</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonSelected,
                    genderError ? styles.genderButtonError : null,
                  ]}
                  onPress={() => {
                    setGender('male');
                    if (genderError) setGenderError('');
                  }}
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
                    genderError ? styles.genderButtonError : null,
                  ]}
                  onPress={() => {
                    setGender('female');
                    if (genderError) setGenderError('');
                  }}
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

              <TextInput
                style={[styles.input, heightError ? styles.inputError : null]}
                placeholder={heightError || 'Enter your height (cm)'}
                keyboardType="numeric"
                value={height}
                onChangeText={(text) => {
                  setHeight(text);
                  if (heightError) setHeightError('');
                }}
                placeholderTextColor={heightError ? 'red' : '#888'}
              />
              <TextInput
                style={[styles.input, weightError ? styles.inputError : null]}
                placeholder={weightError || 'Enter your weight (kg)'}
                keyboardType="numeric"
                value={weight}
                onChangeText={(text) => {
                  setWeight(text);
                  if (weightError) setWeightError('');
                }}
                placeholderTextColor={weightError ? 'red' : '#888'}
              />
              <TextInput
                style={[styles.input, ageError ? styles.inputError : null]}
                placeholder={ageError || 'Enter your age'}
                keyboardType="numeric"
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  if (ageError) setAgeError('');
                }}
                placeholderTextColor={ageError ? 'red' : '#888'}
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
  genderButtonError: {
    borderColor: 'red',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderButtonTextSelected: {
    color: '#000',
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
