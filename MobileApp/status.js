import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
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
} from 'react-native';

export default function SignUpPage({ navigation }) {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);

  const getTrainingAdvice = () => {
    if (sessionsPerWeek < 3) {
      return "Training less than 3 times a week may not provide optimal progress. Consider increasing to 3-5 sessions.\nAre you sure you want to continue?";
    } else if (sessionsPerWeek === 6 ) {
      return "Training more than 5 times a week can be intense. Ensure you are getting enough rest.\nAre you sure you want to continue?";
    } else if (sessionsPerWeek === 7) {
      return "Training 7 days a week is only recommended for advanced individuals with carefully planned recovery.\nAre you sure you want to continue?";
    }
    return "";
  };

  const handleGetStartedPress = () => {
    const advice = getTrainingAdvice();
    if (advice && !warningAcknowledged) {
      setWarningMessage(advice);
      setWarningAcknowledged(true); 
    } else {
      navigation.navigate('home'); 
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
                We've estimated that you're underweight. We recommend that you eat in a calorie surplus.
              </Text>
              <Text style={styles.label}>How many times per week do you want to train?</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={7}
                step={1}
                value={sessionsPerWeek}
                onValueChange={(value) => {
                  setSessionsPerWeek(value);
                  setWarningAcknowledged(false);
                  setWarningMessage("");
                }}
                minimumTrackTintColor="#1db344"
                maximumTrackTintColor="#000000"
              />
              <Text style={styles.sessionsText}>{sessionsPerWeek} session(s) per week</Text>
              {warningMessage ? <Text style={styles.warningText}>{warningMessage}</Text> : null}
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
  label: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '80%',
    height: 40,
    alignSelf: 'center',
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
  },
});