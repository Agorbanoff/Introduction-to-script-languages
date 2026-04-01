// status.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API } from "./apiConfig";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
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

export default function StatusPage({ navigation }) {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [bfp, setBfp] = useState(null);

  // 1) Load body-fat percentage on mount
  useEffect(() => {
    const hydrateScreen = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem('sessionsPerWeek');
        if (storedSessions) {
          setSessionsPerWeek(parseInt(storedSessions, 10));
        }

        const res = await authFetch(
          `${BASE_API}/stats/statistics`,
          { method: 'GET' }
        );

        if (res.status === 404 || res.status === 400 || res.status === 422) {
          navigation.replace('statistics');
          return;
        }

        if (!res.ok) {
          Alert.alert('Error', 'Failed to load your statistics.');
          return;
        }

        const data = await parseApiResponse(res);
        setBfp(data.BFP);
      } catch (err) {
        Alert.alert('Error', 'Could not load your onboarding data.');
      }
    };
    hydrateScreen();
  }, [navigation]);

  // 2) Determine warning based on chosen sessions/week
  const getTrainingAdvice = () => {
    if (sessionsPerWeek < 3) {
      return 'Training less than 3 times a week may not provide optimal progress. Consider increasing to 3–5 sessions.\nAre you sure you want to continue?';
    }
    if (sessionsPerWeek === 6) {
      return 'Training more than 5 times a week can be intense. Ensure you are getting enough rest.\nAre you sure you want to continue?';
    }
    if (sessionsPerWeek === 7) {
      return 'Training 7 days a week is only recommended for advanced individuals with carefully planned recovery.\nAre you sure you want to continue?';
    }
    return '';
  };

  // 3) Handle “Get started” press
  const handleGetStartedPress = async () => {
    const advice = getTrainingAdvice();
    if (advice && !warningAcknowledged) {
      setWarningMessage(advice);
      setWarningAcknowledged(true);
      return;
    }

    try {
      const res = await authFetch(
        `${BASE_API}/stats/training`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessions_per_week: sessionsPerWeek }),
        }
      );
      const data = await parseApiResponse(res);
      console.log('Training save response:', data);

      if (res.ok) {
        await AsyncStorage.setItem('sessionsPerWeek', String(sessionsPerWeek));
        navigation.navigate('gym', { sessionsPerWeek });
      } else {
        Alert.alert('Error', getApiErrorMessage(data, 'Failed to save training info'));
      }
    } catch (err) {
      console.error('Network error:', err);
      Alert.alert('Error', 'Network error while sending training info');
    }
  };

  // Render buttons 1–7
  const renderDayButtons = () =>
    [1, 2, 3, 4, 5, 6, 7].map(day => {
      const isSel = sessionsPerWeek === day;
      return (
        <TouchableOpacity
          key={day}
          style={[styles.dayButton, isSel && styles.dayButtonSelected]}
          onPress={() => {
            setSessionsPerWeek(day);
            setWarningMessage('');
            setWarningAcknowledged(false);
          }}
        >
          <Text
            style={[styles.dayButtonText, isSel && styles.dayButtonTextSelected]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    });

  const bodyStatus =
    bfp != null ? (bfp > 25 ? 'overweight' : 'underweight') : '';
  const calorieStatus = bfp != null ? (bfp > 25 ? 'deficit' : 'surplus') : '';

  return (
    <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <SafeAreaView>
              {bfp != null && (
                <Text style={styles.frontText}>
                  {`We've estimated that you're ${bodyStatus}.\n`}
                  {`We recommend that you eat in a caloric ${calorieStatus}.`}
                </Text>
              )}

              <Text style={styles.captionText}>
                Choose a weekly rhythm that matches your goal while staying in the same futuristic visual style.
              </Text>

              <Text style={styles.label}>
                How many times per week do you want to train?
              </Text>

              <View style={styles.daysRow}>{renderDayButtons()}</View>

              <Text style={styles.sessionsText}>
                {sessionsPerWeek} session(s) per week
              </Text>

              {warningMessage.length > 0 && (
                <View style={styles.warningContainer}>
                  <View style={styles.warningIconWrap}>
                    <Text style={styles.warningIcon}>!</Text>
                  </View>
                  <Text style={styles.warningTitle}>Training warning</Text>
                  <Text style={styles.warningText}>{warningMessage}</Text>
                </View>
              )}
            </SafeAreaView>

            <View style={styles.container}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetStartedPress}
              >
                <Text style={styles.buttonText}>Get started</Text>
              </TouchableOpacity>
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
    marginTop: '35%',
  },
  captionText: {
    textAlign: 'center',
    color: 'rgba(214, 229, 224, 0.74)',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  label: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  dayButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(157,255,224,0.38)',
    borderWidth: 1,
    borderRadius: 100,
    width: '12%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#6ff7c7',
  },
  dayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayButtonTextSelected: {
    color: 'black',
  },
  sessionsText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginVertical: 10,
  },
  warningContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    padding: 18,
    backgroundColor: 'rgba(21, 14, 16, 0.88)',
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 131, 112, 0.18)',
  },
  warningIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 154, 120, 0.12)',
    marginBottom: 12,
  },
  warningIcon: {
    color: '#ffb074',
    fontSize: 22,
    fontWeight: '800',
  },
  warningTitle: {
    color: '#fff5ef',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    textAlign: 'center',
    color: '#ffd2bd',
    fontSize: 14,
    lineHeight: 21,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '60%',
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
