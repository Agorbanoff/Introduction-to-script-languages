// CombinedWorkout.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CombinedWorkout = () => {
  const navigation = useNavigation();
  // "push" or "pull"
  const [workoutType, setWorkoutType] = useState('push');

  // Define Push Day exercises
  const pushExercises = [
    {
      id: 1,
      name: 'Warmup',
      sets: 1,
      reps: 'N/A',
      description: 'Light cardio & dynamic stretching',
    },
    {
      id: 2,
      name: 'Bench Press',
      sets: 3,
      reps: '8-12',
      description: 'Focus on proper form and control',
    },
    {
      id: 3,
      name: 'Chest Fly Machine',
      sets: 3,
      reps: '8-12',
      description: 'Slow, controlled movement for chest activation',
    },
    {
      id: 4,
      name: 'Lateral Raises',
      sets: 3,
      reps: '15-20',
      description: 'Keep a slight bend in your elbows and raise to shoulder height',
    },
    {
      id: 5,
      name: 'Face Pulls',
      sets: 3,
      reps: '12-16',
      description: 'Focus on scapular retraction and squeeze at the end',
    },
    {
      id: 6,
      name: 'Tricep Pushdown',
      sets: 3,
      reps: '8-12',
      description: 'Use full range of motion for tricep engagement',
    },
    {
      id: 7,
      name: 'Overhead Tricep Extension',
      sets: 3,
      reps: '8-12',
      description: 'Keep your core engaged and move slowly',
    },
    {
      id: 8,
      name: 'Cool Down',
      sets: 1,
      reps: 'N/A',
      description: 'Static stretches & foam rolling',
    },
  ];

  // Define Pull Day exercises
  const pullExercises = [
    {
      id: 1,
      name: 'Warmup',
      sets: 1,
      reps: 'N/A',
      description: 'Light cardio & dynamic stretching',
    },
    {
      id: 2,
      name: 'Pull Ups',
      sets: 3,
      reps: '8-12',
      description: 'Focus on full range of motion',
    },
    {
      id: 3,
      name: 'Lat Pulldown',
      sets: 3,
      reps: '8-12',
      description: 'Keep your back engaged and squeeze at the bottom',
    },
    {
      id: 4,
      name: 'Low Row',
      sets: 3,
      reps: '8-12',
      description: 'Maintain proper posture throughout the movement',
    },
    {
      id: 5,
      name: 'Preacher Curl',
      sets: 3,
      reps: '8-12',
      description: 'Focus on a slow and controlled movement',
    },
    {
      id: 6,
      name: 'Bicep Curl',
      sets: 3,
      reps: '8-12',
      description: 'Keep elbows fixed and squeeze at the top',
    },
  ];

  // Select the appropriate exercise array based on workoutType
  const currentExercises = workoutType === 'push' ? pushExercises : pullExercises;

  // Render a single exercise item
  const renderExerciseItem = (exercise, index) => (
    <View key={exercise.id} style={styles.exerciseRow}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineCircle}>
          <Text style={styles.timelineText}>{exercise.id}</Text>
        </View>
        {index < currentExercises.length - 1 && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {exercise.sets && exercise.reps ? (
          <Text style={styles.exerciseInfo}>
            Sets: {exercise.sets} | Reps: {exercise.reps}
          </Text>
        ) : (
          <Text style={styles.exerciseInfo}>Follow instructions</Text>
        )}
        <Text style={styles.exerciseDescription}>{exercise.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <ImageBackground
        source={
          workoutType === 'push'
            ? require('./Images/PushImage.jpg')
            : require('./Images/PushImage.jpg')
        }
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>
            {workoutType === 'push' ? 'PUSH DAY' : 'PULL DAY'}
          </Text>
          <Text style={styles.subtitle}>
            {workoutType === 'push'
              ? 'Focus on chest, shoulders & triceps'
              : 'Focus on back & biceps'}
          </Text>
        </View>
      </ImageBackground>

      {/* Toggle Buttons */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, workoutType === 'push' && styles.toggleButtonSelected]}
          onPress={() => setWorkoutType('push')}
        >
          <Text style={[styles.toggleButtonText, workoutType === 'push' && styles.toggleButtonTextSelected]}>
            PUSH
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, workoutType === 'pull' && styles.toggleButtonSelected]}
          onPress={() => setWorkoutType('pull')}
        >
          <Text style={[styles.toggleButtonText, workoutType === 'pull' && styles.toggleButtonTextSelected]}>
            PULL
          </Text>
        </TouchableOpacity>
      </View>

      {/* Exercises List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {currentExercises.map((exercise, index) => renderExerciseItem(exercise, index))}
      </ScrollView>

      {/* Navigation (Back button) */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1db344" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CombinedWorkout;

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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    backgroundColor: '#222',
    borderColor: '#1db344',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  toggleButtonSelected: {
    backgroundColor: '#1db344',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButtonTextSelected: {
    color: 'black',
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
});
