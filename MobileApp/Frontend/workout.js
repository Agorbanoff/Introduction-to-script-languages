import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const exerciseAlternatives = {
  'Bench Press': ['Dumbbell Press', 'Incline Bench Press', 'Push-ups'],
  'Chest Fly Machine': ['Cable Chest Fly', 'Pec Deck', 'Flat Dumbbell Fly'],
  'Barbell Squats': ['Front Squats', 'Goblet Squats', 'Hack Squats'],
  'Barbell Squat': ['Goblet Squat', 'Smith Machine Squat', 'Landmine Squat'],
  'Deadlifts': ['Trap Bar Deadlift', 'Romanian Deadlift', 'Sumo Deadlift'],
  'Barbell Deadlift': ['Snatch-Grip Deadlift', 'Deficit Deadlift', 'Block Pull'],
  'Pull-ups': ['Lat Pulldown', 'Assisted Pull-ups', 'Inverted Rows'],
  'Overhead Tricep Extension': ['Skull Crushers', 'Overhead Cable Extension'],
  'Triceps Dips': ['Close Grip Bench', 'Triceps Rope Pushdown'],
  'Barbell Rows': ['Dumbbell Rows', 'Seated Cable Rows'],
  'Bicep Curls': ['EZ-Bar Curls', 'Hammer Curls'],
  'Barbell Curl': ['Preacher Curl', 'Cable Curl'],
  'Dumbbell Shoulder Press': ['Arnold Press', 'Barbell Shoulder Press'],
  'Lat Pulldown': ['Cable Pullover', 'Machine Pull-down'],
  'Lateral Raises': ['Cable Lateral Raise', 'Upright Row'],
  'Tricep Pushdown': ['Rope Pushdown', 'Straight Bar Pushdown'],
  'Leg Press': ['Hack Squat', 'Belt Squat'],
  'Romanian Deadlifts': ['Good Mornings', 'Single-leg RDL'],
  'Walking Lunges': ['Split Squats', 'Step Ups'],
  'Calf Raises': ['Seated Calf Raises', 'Donkey Calf Raises'],
  'Overhead Press': ['Seated Dumbbell Press', 'Machine Shoulder Press'],
  'Plank Hold': ['Side Plank', 'Plank with Arm Lift'],
  'Hollow Body Hold': ['Boat Pose', 'Leg Raises'],
  'Dead Bug': ['Bird Dog', 'Leg Lowers'],
  'Glute Bridge March': ['Hip Thrust', 'Single-leg Glute Bridge'],
  'Leg Curl Machine': ['Stability Ball Curl', 'Nordic Curl'],
  'Leg Extensions': ['Resistance Band Extension', 'Sissy Squats'],
  'Cat-Cow Stretch': ['Child’s Pose', 'Pelvic Tilt'],
  'World’s Greatest Stretch': ['Dynamic Lunge + Reach', 'Inchworm to Cobra'],
  'Warmup': ['Light Cardio', 'Dynamic Stretching', 'Jump Rope'],
  'Cool Down': ['Foam Rolling', 'Static Stretching', 'Breathing Exercise'],
};

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
  LEGS_AND_CORE: {
    title: 'LEGS AND CORE',
    subtitle: 'Legs and core strength',
    image: require('./Images/LegImage.jpg'), // Add the image for this workout
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio & dynamic stretching' },
      { id: 2, name: 'Barbell Squats', sets: 4, reps: '8-12', description: 'Full squat depth' },
      { id: 3, name: 'Romanian Deadlifts', sets: 3, reps: '8-12', description: 'Focus on hamstrings' },
      { id: 4, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Glutes & quads focus' },
      { id: 5, name: 'Plank Hold', sets: 3, reps: '30-60 sec', description: 'Core stability' },
      { id: 6, name: 'Leg Raises', sets: 3, reps: '15-20', description: 'Lower abdominal focus' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch hamstrings & quads' },
    ],
  },
  ARM_DAY: {
    title: 'ARM DAY',
    subtitle: 'Biceps & Triceps',
    image: require('./Images/ArmImage.jpg'), // Add the image for this workout
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio & arm circles' },
      { id: 2, name: 'Bicep Curls', sets: 4, reps: '8-12', description: 'Control the movement' },
      { id: 3, name: 'Triceps Dips', sets: 3, reps: '8-12', description: 'Bodyweight or assisted' },
      { id: 4, name: 'Tricep Pushdown', sets: 3, reps: '8-12', description: 'Full range motion' },
      { id: 5, name: 'Hammer Curls', sets: 3, reps: '10-15', description: 'For bicep and forearm development' },
      { id: 6, name: 'Skull Crushers', sets: 3, reps: '8-12', description: 'Focus on tricep contraction' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch arms and shoulders' },
    ],
  },
  CHEST_AND_BACK: {
    title: 'CHEST AND BACK',
    subtitle: 'Chest & Back strength',
    image: require('./Images/UpperImage.jpg'), // Add the image for this workout
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio & dynamic stretches' },
      { id: 2, name: 'Bench Press', sets: 4, reps: '8-12', description: 'Control each rep' },
      { id: 3, name: 'Barbell Rows', sets: 3, reps: '8-12', description: 'Focus on back contraction' },
      { id: 4, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Wide grip' },
      { id: 5, name: 'Chest Fly Machine', sets: 3, reps: '8-12', description: 'Controlled motion' },
      { id: 6, name: 'Dumbbell Pullover', sets: 3, reps: '10-12', description: 'Stretch and contract the chest' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch chest & back' },
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
  REST_DAY: {
    title: 'REST DAY',
    subtitle: 'Recovery and relaxation',
    image: require('./Images/FullBodyImage.jpg'), // Add an appropriate image for rest day
    exercises: [
      { id: 1, name: 'Rest and Recover', sets: 'N/A', reps: 'N/A', description: 'Take the day off to recover.' },
      { id: 2, name: 'Optional: Light Stretching', sets: 1, reps: '10-15 min', description: 'Gentle stretches to stay loose.' },
      { id: 3, name: 'Optional: Easy Walk', sets: 1, reps: '20-30 min', description: 'A light walk to promote blood flow.' },
    ],
  },
};
const WorkoutPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutType } = route.params || {};

  const key = workoutType?.replace(/[\s-]/g, '_').toUpperCase();

  const basePlan = workoutPlans[key] || null;
  const [plan, setPlan] = useState(basePlan);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  // Special handling for Rest Day
  // Special handling for Rest Day
  if (key === 'REST_DAY') {
    return (
      <View style={{ flex: 1, backgroundColor: '#111' }}>
        <ImageBackground
          source={require('./Images/FullBodyImage.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>{plan.title}</Text>
            <Text style={styles.subtitle}>{plan.subtitle}</Text>
          </View>
        </ImageBackground>
  
        <View style={[styles.scroll, { flex: 1 }]}>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>💡 Recovery is just as important as the workout.</Text>
            <Text style={styles.tipText}>
              Get at least 7–9 hours of sleep, hydrate, and eat enough protein.
            </Text>
          </View>
  
          <Text style={styles.sectionTitle}>Optional Light Activities:</Text>
  
          {plan.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.activityCard}>
              <Text style={styles.activityName}>{exercise.name.replace('Optional: ', '')}</Text>
              <Text style={styles.activityDescription}>{exercise.description}</Text>
            </View>
          ))}
  
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.resetText}>Back to Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  
  
  
  
  const handleOpenModal = (name, index) => {
    if (!exerciseAlternatives[name]) return;
    setSelectedExercise(name);
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleSwap = (altName) => {
    const updated = [...plan.exercises];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      name: altName,
      description: `Alternative to ${selectedExercise}`,
    };
    setPlan({ ...plan, exercises: updated });
    setModalVisible(false);
  };

  const resetPlan = () => {
    setPlan(workoutPlans[key]);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={plan.image} style={styles.headerImage}>
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.subtitle}>{plan.subtitle}</Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scroll}>
        {plan.exercises.map((exercise, index) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseRow}
            onPress={() => handleOpenModal(exercise.name, index)}
          >
            <View style={styles.timelineContainer}>
              <View style={styles.timelineCircle}>
                <Text style={styles.timelineText}>{exercise.id}</Text>
              </View>
              {index < plan.exercises.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseInfo}>
                Sets: {exercise.sets} | Reps: {exercise.reps}
              </Text>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.resetButton} onPress={resetPlan}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.resetText}>Reset to original</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Replace "{selectedExercise}" with:</Text>
            <FlatList
              data={exerciseAlternatives[selectedExercise]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSwap(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  container: { flex: 1, backgroundColor: '#111' },
  headerImage: { 
    width: '100%', 
    height: 200, 
    justifyContent: 'flex-end' 
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)', // Updated overlay to make text stand out
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
  scroll: { padding: 16, paddingBottom: 40 },
  exerciseRow: { flexDirection: 'row', marginBottom: 20 },
  timelineContainer: { width: 40, alignItems: 'center' },
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
  exerciseInfo: { color: '#ccc', fontSize: 14 },
  exerciseDescription: { color: '#aaa', fontSize: 12, marginTop: 4 },
  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  resetText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: { color: '#fff', fontSize: 14 },
  modalCancel: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 'bold',
  },

  /* Rest Day Page Styles */
  restContainer: {
    flexGrow: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  restTitle: {
    fontSize: 30,
    color: '#1db344',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  restMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  restTip: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tipBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipTitle: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  
  restTipText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  restSubheading: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  restActivities: {
    marginBottom: 24,
  },
  restItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  restButton: {
    flexDirection: 'row',
    backgroundColor: '#1db344',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  restButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },

  /* New style for Activity Cards */
  activityCard: {
    backgroundColor: '#222', // Dark background for better visibility
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  activityName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  activitySection: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  /* Adjustments for better visibility and usability */
  textOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Improved contrast for text
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  textContent: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});


