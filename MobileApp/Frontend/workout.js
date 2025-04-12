import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const workoutPlans = {
  PUSH: {
    title: 'PUSH DAY',
    subtitle: 'Chest, shoulders & triceps',
    image: require('./Images/PushImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio & dynamic stretching' },
      { id: 2, name: 'Bench Press', sets: 3, reps: '8-12', description: 'Focus on proper form and control' },
      { id: 3, name: 'Chest Fly Machine', sets: 3, reps: '8-12', description: 'Slow and controlled movement' },
      { id: 4, name: 'Lateral Raises', sets: 3, reps: '15-20', description: 'Raise to shoulder height' },
      { id: 5, name: 'Face Pulls', sets: 3, reps: '12-16', description: 'Scapular retraction focus' },
      { id: 6, name: 'Tricep Pushdown', sets: 3, reps: '8-12', description: 'Full range of motion' },
      { id: 7, name: 'Overhead Tricep Extension', sets: 3, reps: '8-12', description: 'Controlled reps' },
      { id: 8, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Static stretches & foam rolling' },
    ],
  },
  PULL: {
    title: 'PULL DAY',
    subtitle: 'Back & biceps focus',
    image: require('./Images/PullImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio & mobility' },
      { id: 2, name: 'Deadlifts', sets: 4, reps: '5-8', description: 'Power movement' },
      { id: 3, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Wide grip if possible' },
      { id: 4, name: 'Barbell Rows', sets: 3, reps: '10-12', description: 'Elbows tucked' },
      { id: 5, name: 'Face Pulls', sets: 3, reps: '12-15', description: 'Shoulder health' },
      { id: 6, name: 'Bicep Curls', sets: 3, reps: '10-15', description: 'Squeeze at top' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch lats, traps & biceps + foam rolling' },
    ],
  },
  LEGS: {
    title: 'LEG DAY',
    subtitle: 'Glutes, quads & hamstrings',
    image: require('./Images/LegImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cycling or treadmill' },
      { id: 2, name: 'Barbell Squats', sets: 4, reps: '6-10', description: 'Go deep, keep form' },
      { id: 3, name: 'Leg Press', sets: 3, reps: '10-15', description: 'Full extension' },
      { id: 4, name: 'Romanian Deadlifts', sets: 3, reps: '10-12', description: 'Stretch hamstrings' },
      { id: 5, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Control the descent' },
      { id: 6, name: 'Calf Raises', sets: 4, reps: '15-20', description: 'Full squeeze at top' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Foam rolling, hamstring & quad stretches' },
    ],
  },
  CORE_MOBILITY: {
    title: 'CORE MOBILITY',
    subtitle: 'Core strength & mobility work',
    image: require('./Images/CoreImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: '5-min light jog + dynamic stretches' },
      { id: 2, name: 'Plank Hold', sets: 3, reps: '30-60 sec', description: 'Core activation' },
      { id: 3, name: 'Hollow Body Hold', sets: 3, reps: '20-30 sec', description: 'Maintain tension' },
      { id: 4, name: 'Dead Bug', sets: 3, reps: '10 each side', description: 'Controlled core motion' },
      { id: 5, name: 'Glute Bridge March', sets: 3, reps: '10 each leg', description: 'Glute & core integration' },
      { id: 6, name: 'Cat-Cow Stretch', sets: 2, reps: '10 reps', description: 'Spinal mobility' },
      { id: 7, name: 'World’s Greatest Stretch', sets: 2, reps: '5 each side', description: 'Full body mobility flow' },
      { id: 8, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Breathing, foam rolling, & static stretches' },
    ],
  },
  UPPER_BODY: {
    title: 'UPPER BODY',
    subtitle: 'Chest, back, shoulders & arms',
    image: require('./Images/UpperImage.jpg'),
    exercises: [
      { id: 1, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Warm-up for the lats' },
      { id: 2, name: 'Bench Press', sets: 4, reps: '6-10', description: 'Focus on power' },
      { id: 3, name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', description: 'Control each rep' },
      { id: 4, name: 'Lat Pulldown', sets: 3, reps: '10-15', description: 'Full range' },
      { id: 5, name: 'Barbell Curl', sets: 3, reps: '10-12', description: 'Squeeze at top' },
      { id: 6, name: 'Triceps Dips', sets: 3, reps: '8-12', description: 'Bodyweight or assisted' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch shoulders & arms' },
    ],
  },
  LOWER_BODY: {
    title: 'LOWER BODY',
    subtitle: 'Quads, glutes & hamstrings',
    image: require('./Images/LowerImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light treadmill or bike' },
      { id: 2, name: 'Barbell Squat', sets: 4, reps: '6-10', description: 'Go deep, drive up strong' },
      { id: 3, name: 'Leg Curl Machine', sets: 3, reps: '10-12', description: 'Hamstring isolation' },
      { id: 4, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Glute & quad focus' },
      { id: 5, name: 'Leg Extensions', sets: 3, reps: '12-15', description: 'Lockout at the top' },
      { id: 6, name: 'Calf Raises', sets: 4, reps: '15-20', description: 'Full squeeze at top' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch quads, glutes & calves' },
    ],
  },
  FULL_BODY: {
    title: 'FULL BODY',
    subtitle: 'Balanced compound strength training',
    image: require('./Images/FullBodyImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: '5-10 minutes jump rope or rowing + dynamic stretches' },
      { id: 2, name: 'Barbell Deadlift', sets: 4, reps: '5-8', description: 'Heavy pull – keep back neutral' },
      { id: 3, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Back and arms' },
      { id: 4, name: 'Bench Press', sets: 4, reps: '6-10', description: 'Chest power movement' },
      { id: 5, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Legs and glutes' },
      { id: 6, name: 'Overhead Press', sets: 3, reps: '10-12', description: 'Shoulder strength' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Full-body stretch & foam rolling' },
    ],
  },
};

const WorkoutPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutType } = route.params || {};

  // 💥 Handles names like "CORE MOBILITY", "Core-Mobility", "core mobility"
  const key = workoutType.replace(/[\s-]/g, '_').toUpperCase();
  const plan = workoutPlans[key] || null;

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No workout found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={plan.image}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.subtitle}>{plan.subtitle}</Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scroll}>
        {plan.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseRow}>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineCircle}>
                <Text style={styles.timelineText}>{exercise.id}</Text>
              </View>
              {index < plan.exercises.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseInfo}>
                Sets: {exercise.sets} | Reps: {exercise.reps}
              </Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  headerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },
  scroll: {
    padding: 16,
    paddingBottom: 20,
  },
  exerciseRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    height: 50,
    backgroundColor: '#555',
    marginTop: 2,
  },
  exerciseContent: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseInfo: {
    color: '#ccc',
    fontSize: 14,
  },
  exerciseDescription: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  navBar: {
    height: 60,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  backLink: {
    color: '#1db344',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
