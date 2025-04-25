import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function StatusPage({ navigation }) {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [bfp, setBfp] = useState(null);

   // fetch body fat percentage on mount
   useEffect(() => {
    const fetchBfp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated.');
          return;
        }
        const res = await fetch('https://gymax.onrender.com/stats/statistics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch body fat percentage');
        }
        const data = await res.json();
        // assume backend returns { bodyFatPercentage: number }
        setBfp(data.BFP);
      } catch (err) {
        console.error('BFP fetch error:', err);
        Alert.alert('Error', 'Could not load your body fat data.');
      }
    };

    fetchBfp();
  }, []);

  // determine statuses once we have bfp
  const bodyStatus     = bfp > 25 ? 'overweight'  : 'underweight';
  const calorieStatus  = bfp > 25 ? 'deficit'     : 'surplus';

  const getTrainingAdvice = () => {
    if (sessionsPerWeek < 3) {
      return "Training less than 3 times a week may not provide optimal progress. Consider increasing to 3-5 sessions.\nAre you sure you want to continue?";
    } else if (sessionsPerWeek === 6) {
      return "Training more than 5 times a week can be intense. Ensure you are getting enough rest.\nAre you sure you want to continue?";
    } else if (sessionsPerWeek === 7) {
      return "Training 7 days a week is only recommended for advanced individuals with carefully planned recovery.\nAre you sure you want to continue?";
    }
    return "";
  };

  const handleGetStartedPress = async () => {
    const advice = getTrainingAdvice();

    if (advice && !warningAcknowledged) {
      setWarningMessage(advice);
      setWarningAcknowledged(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');

      if (!token || !email) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const response = await fetch('https://gymax.onrender.com/stats/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessions_per_week: sessionsPerWeek,
        }),
      });

      const data = await response.json();
      console.log('Training save response:', data);

      if (response.ok) {
        navigation.navigate('gym', { sessionsPerWeek });
      } else {
        Alert.alert(
          'Error',
          Array.isArray(data.detail)
            ? data.detail.map(d => d.msg).join('\n')
            : data.detail || 'Failed to save training info'
        );
        
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      Alert.alert('Error', 'Network error while sending training info');
    }
  };

  const renderDayButtons = () => {
    return [...Array(7)].map((_, i) => {
      const day = i + 1;
      const isSelected = sessionsPerWeek === day;

      return (
        <TouchableOpacity
          key={day}
          style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
          onPress={() => {
            setSessionsPerWeek(day);
            setWarningMessage('');
            setWarningAcknowledged(false);
          }}
        >
          <Text style={[styles.dayButtonText, isSelected && styles.dayButtonTextSelected]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    });
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
              {`We've estimated that you're ${bodyStatus}.\n`}
              {`We recommend that you eat in a caloric ${calorieStatus}.`}
              </Text>
              <Text style={styles.label}>How many times per week do you want to train?</Text>

              <View style={styles.daysRow}>
                {renderDayButtons()}
              </View>

              <Text style={styles.sessionsText}>
                {sessionsPerWeek} session(s) per week
              </Text>

              {warningMessage ? (
                <Text style={styles.warningText}>{warningMessage}</Text>
              ) : null}
            </SafeAreaView>

            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={handleGetStartedPress}>
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
    marginTop: 10,
    marginBottom: 10,
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
