// status.js
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { authFetch } from './authFetch';

export default function StatusPage({ navigation }) {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [bfp, setBfp] = useState(null);

  // 1) Load body-fat percentage on mount
  useEffect(() => {
    const fetchBfp = async () => {
      try {
        const res = await authFetch(
          'https://gymax.onrender.com/stats/statistics',
          { method: 'GET' }
        );
        if (!res.ok) throw new Error('Failed to fetch body fat percentage');
        const data = await res.json();
        setBfp(data.BFP);
      } catch (err) {
        console.error('BFP fetch error:', err);
        Alert.alert('Error', 'Could not load your body fat data.');
      }
    };
    fetchBfp();
  }, []);

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
        'https://gymax.onrender.com/stats/training',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessions_per_week: sessionsPerWeek }),
        }
      );
      const data = await res.json();
      console.log('Training save response:', data);

      if (res.ok) {
        navigation.navigate('aiFetch', { sessionsPerWeek });
      } else {
        const msg = Array.isArray(data.detail)
          ? data.detail.map(d => d.msg).join('\n')
          : data.detail || 'Failed to save training info';
        Alert.alert('Error', msg);
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
              {bfp != null && (
                <Text style={styles.frontText}>
                  {`We've estimated that you're ${bodyStatus}.\n`}
                  {`We recommend that you eat in a caloric ${calorieStatus}.`}
                </Text>
              )}

              <Text style={styles.label}>
                How many times per week do you want to train?
              </Text>

              <View style={styles.daysRow}>{renderDayButtons()}</View>

              <Text style={styles.sessionsText}>
                {sessionsPerWeek} session(s) per week
              </Text>

              {warningMessage.length > 0 && (
                <Text style={styles.warningText}>{warningMessage}</Text>
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
    marginTop: '35%',
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
    backgroundColor: '#222',
    borderColor: '#1db344',
    borderWidth: 1,
    borderRadius: 100,
    width: '12%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#1db344',
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
  warningText: {
    textAlign: 'center',
    color: '#FFA500',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: '60%',
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
