import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedScreenView from './AnimatedScreenView';
import FloatingNavBar from './FloatingNavBar';
import FuturisticBackdrop from './FuturisticBackdrop';

const workoutImages = {
  PUSH: require('./Images/PushImage.jpg'),
  PULL: require('./Images/PullImage.jpg'),
  LEGS: require('./Images/LegImage.jpg'),
  LEGS_AND_CORE: require('./Images/LegImage.jpg'),
  ARM_DAY: require('./Images/ArmImage.jpg'),
  CHEST_AND_BACK: require('./Images/UpperImage.jpg'),
  CORE_MOBILITY: require('./Images/CoreImage.jpg'),
  UPPER_BODY: require('./Images/UpperImage.jpg'),
  LOWER_BODY: require('./Images/LowerImage.jpg'),
  FULL_BODY: require('./Images/FullBodyImage.jpg'),
  REST_DAY: require('./Images/homePagePhoto.jpg'),
};

const GymPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [sessionsPerWeek, setSessionsPerWeek] = useState(null);

  useEffect(() => {
    const loadSessions = async () => {
      if (route.params?.sessionsPerWeek) {
        const nextValue = parseInt(route.params.sessionsPerWeek, 10);
        setSessionsPerWeek(nextValue);
        await AsyncStorage.setItem('sessionsPerWeek', String(nextValue));
      } else {
        const stored = await AsyncStorage.getItem('sessionsPerWeek');
        setSessionsPerWeek(stored ? parseInt(stored, 10) : 3);
      }
    };
    loadSessions();
  }, [route.params]);

  if (sessionsPerWeek === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db344" />
      </View>
    );
  }

  const totalDays = 7;
  const cycle = ['PUSH', 'PULL', 'LEGS'];
  let schedule = [];

  switch (sessionsPerWeek) {
    case 1:
      schedule = ['FULL-BODY', ...Array(6).fill('Rest day')];
      break;
    case 2:
      schedule = ['UPPER BODY', 'Rest day', 'Rest day', 'Rest day', 'LOWER BODY', 'Rest day', 'Rest day'];
      break;
    case 3:
      schedule = Array.from({ length: totalDays }, (_, i) => (i < 3 ? cycle[i] : 'Rest day'));
      break;
    case 4:
      schedule = ['UPPER BODY', 'LOWER BODY', 'Rest day', 'UPPER BODY', 'LOWER BODY', 'Rest day', 'Rest day'];
      break;
    case 5:
      schedule = ['PUSH', 'PULL', 'LEGS AND CORE', 'ARM DAY', 'CHEST AND BACK', 'Rest day', 'Rest day'];
      break;
    case 6:
      schedule = ['PUSH', 'PULL', 'LEGS', 'Rest day', 'PUSH', 'PULL', 'LEGS'];
      break;
    case 7:
      schedule = ['PUSH', 'PULL', 'LEGS', 'CORE MOBILITY', 'PUSH', 'PULL', 'LEGS'];
      break;
    default:
      schedule = Array.from({ length: totalDays }, (_, i) => (i < sessionsPerWeek ? 'Workout' : 'Rest day'));
  }

  const workoutData = schedule.map((type, index) => ({
    id: index + 1,
    type,
    image: workoutImages[type.replace(/[\s-]/g, '_').toUpperCase()] || require('./Images/gymPhoto.jpg'),
  }));

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  const displayDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
      <AnimatedScreenView style={styles.content}>
        <View style={styles.dayRow}>
          {displayDays.map((day, index) => (
            <View
              key={day}
              style={[
                styles.dayPill,
                index === todayIndex && styles.activeDayPill,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  index === todayIndex && styles.activeDayText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {workoutData.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                index === todayIndex && styles.activeCard,
              ]}
              onPress={() => {
                const params = { workoutType: item.type, dayLabel: displayDays[index] };
                if (item.type.toUpperCase() !== 'REST DAY') {
                  params.day = item.id;
                  params.sessionsPerWeek = sessionsPerWeek;
                }
                navigation.navigate('workout', params);
              }}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardDay}>{displayDays[index]}</Text>
                  <Text style={styles.cardText}>{item.type}</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#b8cbc5"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </AnimatedScreenView>

      <FloatingNavBar navigation={navigation} activeRoute="gym" />
    </FuturisticBackdrop>
  );
};

export default GymPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06090d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    paddingTop: 42,
    paddingHorizontal: 16,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(8, 12, 19, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dayPill: {
    minWidth: 40,
    paddingHorizontal: 6,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayPill: {
    backgroundColor: '#6ff7c7',
  },
  dayText: {
    color: '#d6e5df',
    fontSize: 12,
    fontWeight: '700',
  },
  activeDayText: {
    color: '#071611',
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 140,
    paddingTop: 4,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(11, 16, 24, 0.66)',
    borderRadius: 28,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  activeCard: {
    borderWidth: 1,
    borderColor: '#6ff7c7',
    backgroundColor: 'rgba(111, 247, 199, 0.11)',
  },
  cardImage: {
    width: 82,
    height: 82,
    borderRadius: 20,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMeta: {
    flex: 1,
  },
  cardDay: {
    color: '#9dffe0',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  cardText: {
    color: '#f1fbf7',
    fontSize: 16,
    fontWeight: '600',
  },
});
