import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const GymPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionsPerWeek = 3 } = route.params || {};

  const totalDays = 7;
  const cycle = ['PUSH', 'PULL', 'LEGS'];
  let schedule = [];

  if (sessionsPerWeek === 1) {
    schedule = ['FULL-BODY', 'Rest day', 'Rest day', 'Rest day', 'Rest day', 'Rest day', 'Rest day'];
  } else if (sessionsPerWeek === 2) {
    schedule = ['UPPER BODY', 'Rest day', 'Rest day', 'Rest day', 'LOWER BODY', 'Rest day', 'Rest day'];
  } else if (sessionsPerWeek === 3) {
    schedule = Array.from({ length: totalDays }, (_, i) => i < 3 ? cycle[i] : 'Rest day');
  } else if (sessionsPerWeek === 4) {
    schedule = ['UPPER BODY', 'LOWER BODY', 'Rest day', 'UPPER BODY', 'LOWER BODY', 'Rest day', 'Rest day'];
  } else if (sessionsPerWeek === 5) {
    schedule = ['PUSH', 'PULL', 'LEGS AND CORE', 'ARM DAY', 'CHEST AND BACK', 'Rest day', 'Rest day'];
  } else if (sessionsPerWeek === 6) {
    schedule = ['PUSH', 'PULL', 'LEGS', 'Rest day', 'PUSH', 'PULL', 'LEGS'];
  } else if (sessionsPerWeek === 7) {
    schedule = ['PUSH', 'PULL', 'LEGS', 'CORE MOBILITY', 'PUSH', 'PULL', 'LEGS'];
  } else {
    schedule = Array.from({ length: totalDays }, (_, i) => i < sessionsPerWeek ? 'Workout' : 'Rest day');
  }

  const workoutData = schedule.map((type, index) => ({
    id: index + 1,
    type,
    image: require('./Images/gymPhoto.jpg'),
  }));

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  const displayDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const currentWeek = getWeekNumber(today);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>WORKOUTS</Text>

        <View style={styles.dayRow}>
          {displayDays.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View
                style={[
                  styles.dayCircle,
                  index === todayIndex && styles.activeDayCircle,
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
              <Text
                style={[
                  styles.weekLabel,
                  index === todayIndex && styles.activeWeekLabel,
                ]}
              >
                WK {currentWeek}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.editRow}>
          <Text style={styles.editText}>Edit</Text>
          <Ionicons name="pencil" size={16} color="#c33" />
        </View>

        <ScrollView style={styles.scroll}>
          {workoutData.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                index === todayIndex && styles.activeCard,
              ]}
              onPress={() => {
                if (item.type.toUpperCase() === 'REST DAY') {
                  navigation.navigate('workout', {
                    workoutType: 'REST DAY',
                  });
                } else {
                  navigation.navigate('workout', {
                    day: item.id,
                    workoutType: item.type,
                    sessionsPerWeek,
                  });
                }
              }}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardId}>{item.id}</Text>
                <Text style={styles.cardText}>{item.type}</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#999"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'gym' }],
            })
          }
        >
          <Ionicons name="barbell-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'diet' }],
            })
          }
        >
          <Ionicons name="restaurant-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'settings' }],
            })
          }
        >
          <Ionicons name="settings-outline" size={28} color="#1db344" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GymPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayCircle: {
    backgroundColor: '#c33',
  },
  dayText: {
    color: '#ccc',
  },
  activeDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  weekLabel: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
  },
  activeWeekLabel: {
    color: '#c33',
    fontWeight: 'bold',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editText: {
    color: '#ccc',
    marginRight: 6,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeCard: {
    borderWidth: 1,
    borderColor: '#1db344',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardId: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
  },
  cardText: {
    color: '#ccc',
    flex: 1,
  },
  navBar: {
    height: 60,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});
