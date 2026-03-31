import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BASE_API } from "./apiConfig";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { authFetch } from './authFetch';
import { getApiErrorMessage, parseApiResponse } from './apiResponse';
import FuturisticBackdrop from './FuturisticBackdrop';

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
        const res = await authFetch(`${BASE_API}/auth/getusername`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to load profile');

        const data = await parseApiResponse(res);
        setUsername(data?.username || '');
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
      const res = await authFetch(`${BASE_API}/stats/statistics`, {
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

      const data = await parseApiResponse(res);
      console.log('Statistics response:', data);

      if (res.ok) {
        navigation.navigate('status');
      } else {
        Alert.alert('Error', getApiErrorMessage(data, 'Failed to save statistics'));
      }
    } catch (error) {
      console.error('Error submitting stats:', error);
      Alert.alert('Error', 'Network error while sending statistics');
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
              <Text style={styles.frontText}>
                {`Hello, ${username || 'there'}!`}{'\n'}Let's gather some statistics about you!
              </Text>
              <Text style={styles.captionText}>
                We’ll keep the same sleek neon atmosphere while setting up the numbers behind your plan.
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
    </FuturisticBackdrop>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  frontText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    color: '#9dffe0',
    padding: 30,
  },
  captionText: {
    textAlign: 'center',
    color: 'rgba(214, 229, 224, 0.74)',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(157,255,224,0.38)',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  genderButtonSelected: {
    backgroundColor: '#6ff7c7',
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
});
