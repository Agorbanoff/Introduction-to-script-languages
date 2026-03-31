import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedScreenView from './AnimatedScreenView';
import FuturisticBackdrop from './FuturisticBackdrop';

const exerciseAlternatives = {
  'Bench Press': ['Dumbbell Press', 'Incline Bench Press', 'Push-ups'],
  'Chest Fly Machine': ['Cable Chest Fly', 'Pec Deck', 'Flat Dumbbell Fly'],
  'Barbell Squats': ['Front Squats', 'Goblet Squats', 'Hack Squats'],
  'Barbell Squat': ['Goblet Squat', 'Smith Machine Squat', 'Landmine Squat'],
  Deadlifts: ['Trap Bar Deadlift', 'Romanian Deadlift', 'Sumo Deadlift'],
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
  'Cat-Cow Stretch': ['Childs Pose', 'Pelvic Tilt'],
  "World's Greatest Stretch": ['Dynamic Lunge + Reach', 'Inchworm to Cobra'],
  Warmup: ['Light Cardio', 'Dynamic Stretching', 'Jump Rope'],
  'Cool Down': ['Foam Rolling', 'Static Stretching', 'Breathing Exercise'],
};

const workoutPlans = {
  PUSH: {
    title: 'PUSH DAY',
    subtitle: 'Chest, shoulders and triceps',
    image: require('./Images/PushImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio and dynamic stretching' },
      { id: 2, name: 'Bench Press', sets: 3, reps: '8-12', description: 'Focus on proper form and control' },
      { id: 3, name: 'Chest Fly Machine', sets: 3, reps: '8-12', description: 'Slow and controlled movement' },
      { id: 4, name: 'Lateral Raises', sets: 3, reps: '15-20', description: 'Raise to shoulder height' },
      { id: 5, name: 'Face Pulls', sets: 3, reps: '12-16', description: 'Scapular retraction focus' },
      { id: 6, name: 'Tricep Pushdown', sets: 3, reps: '8-12', description: 'Full range of motion' },
      { id: 7, name: 'Overhead Tricep Extension', sets: 3, reps: '8-12', description: 'Controlled reps' },
      { id: 8, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Static stretching and foam rolling' },
    ],
  },
  PULL: {
    title: 'PULL DAY',
    subtitle: 'Back and biceps focus',
    image: require('./Images/PullImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio and mobility' },
      { id: 2, name: 'Deadlifts', sets: 4, reps: '5-8', description: 'Power movement with crisp setup' },
      { id: 3, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Use a full hang if possible' },
      { id: 4, name: 'Barbell Rows', sets: 3, reps: '10-12', description: 'Keep elbows tucked and chest proud' },
      { id: 5, name: 'Face Pulls', sets: 3, reps: '12-15', description: 'Shoulder health and posture' },
      { id: 6, name: 'Bicep Curls', sets: 3, reps: '10-15', description: 'Pause at the top for tension' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch lats, traps and biceps' },
    ],
  },
  LEGS: {
    title: 'LEG DAY',
    subtitle: 'Glutes, quads and hamstrings',
    image: require('./Images/LegImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cycling or treadmill walk' },
      { id: 2, name: 'Barbell Squats', sets: 4, reps: '6-10', description: 'Go deep while staying braced' },
      { id: 3, name: 'Leg Press', sets: 3, reps: '10-15', description: 'Drive through the full foot' },
      { id: 4, name: 'Romanian Deadlifts', sets: 3, reps: '10-12', description: 'Stretch the hamstrings with control' },
      { id: 5, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Control every descent' },
      { id: 6, name: 'Calf Raises', sets: 4, reps: '15-20', description: 'Peak squeeze at the top' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Foam rolling and lower-body stretches' },
    ],
  },
  LEGS_AND_CORE: {
    title: 'LEGS AND CORE',
    subtitle: 'Leg strength with core stability',
    image: require('./Images/LegImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio and dynamic stretching' },
      { id: 2, name: 'Barbell Squats', sets: 4, reps: '8-12', description: 'Own the full squat depth' },
      { id: 3, name: 'Romanian Deadlifts', sets: 3, reps: '8-12', description: 'Hamstring focus with a neutral spine' },
      { id: 4, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Glute and quad focus' },
      { id: 5, name: 'Plank Hold', sets: 3, reps: '30-60 sec', description: 'Brace the entire torso' },
      { id: 6, name: 'Leg Raises', sets: 3, reps: '15-20', description: 'Lower abdominal control' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch hamstrings and quads' },
    ],
  },
  ARM_DAY: {
    title: 'ARM DAY',
    subtitle: 'Biceps and triceps focus',
    image: require('./Images/ArmImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio and arm circles' },
      { id: 2, name: 'Bicep Curls', sets: 4, reps: '8-12', description: 'Control the negative' },
      { id: 3, name: 'Triceps Dips', sets: 3, reps: '8-12', description: 'Bodyweight or assisted' },
      { id: 4, name: 'Tricep Pushdown', sets: 3, reps: '8-12', description: 'Lock out with control' },
      { id: 5, name: 'Hammer Curls', sets: 3, reps: '10-15', description: 'Build forearm and brachialis strength' },
      { id: 6, name: 'Skull Crushers', sets: 3, reps: '8-12', description: 'Keep elbows stacked' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch arms and shoulders' },
    ],
  },
  CHEST_AND_BACK: {
    title: 'CHEST AND BACK',
    subtitle: 'Upper-body push and pull',
    image: require('./Images/UpperImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light cardio and dynamic mobility' },
      { id: 2, name: 'Bench Press', sets: 4, reps: '8-12', description: 'Control each rep path' },
      { id: 3, name: 'Barbell Rows', sets: 3, reps: '8-12', description: 'Drive elbows behind you' },
      { id: 4, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Full hang with strong scapular control' },
      { id: 5, name: 'Chest Fly Machine', sets: 3, reps: '8-12', description: 'Slow eccentric' },
      { id: 6, name: 'Dumbbell Pullover', sets: 3, reps: '10-12', description: 'Open the chest while keeping ribs down' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch chest and back' },
    ],
  },
  CORE_MOBILITY: {
    title: 'CORE MOBILITY',
    subtitle: 'Core strength with mobility work',
    image: require('./Images/CoreImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Five-minute jog and dynamic stretches' },
      { id: 2, name: 'Plank Hold', sets: 3, reps: '30-60 sec', description: 'Core activation and control' },
      { id: 3, name: 'Hollow Body Hold', sets: 3, reps: '20-30 sec', description: 'Maintain full-body tension' },
      { id: 4, name: 'Dead Bug', sets: 3, reps: '10 each side', description: 'Move slowly and stay braced' },
      { id: 5, name: 'Glute Bridge March', sets: 3, reps: '10 each leg', description: 'Glute and core integration' },
      { id: 6, name: 'Cat-Cow Stretch', sets: 2, reps: '10 reps', description: 'Open the spine segment by segment' },
      { id: 7, name: "World's Greatest Stretch", sets: 2, reps: '5 each side', description: 'Full-body mobility flow' },
      { id: 8, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Breathing, foam rolling and static stretches' },
    ],
  },
  UPPER_BODY: {
    title: 'UPPER BODY',
    subtitle: 'Chest, back, shoulders and arms',
    image: require('./Images/UpperImage.jpg'),
    exercises: [
      { id: 1, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Prime the lats before heavy work' },
      { id: 2, name: 'Bench Press', sets: 4, reps: '6-10', description: 'Drive power through every rep' },
      { id: 3, name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', description: 'Control the tempo' },
      { id: 4, name: 'Lat Pulldown', sets: 3, reps: '10-15', description: 'Full range and full squeeze' },
      { id: 5, name: 'Barbell Curl', sets: 3, reps: '10-12', description: 'Hold the peak contraction' },
      { id: 6, name: 'Triceps Dips', sets: 3, reps: '8-12', description: 'Use assistance if needed' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch shoulders and arms' },
    ],
  },
  LOWER_BODY: {
    title: 'LOWER BODY',
    subtitle: 'Quads, glutes and hamstrings',
    image: require('./Images/LowerImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Light treadmill or bike' },
      { id: 2, name: 'Barbell Squat', sets: 4, reps: '6-10', description: 'Go deep and drive up strong' },
      { id: 3, name: 'Leg Curl Machine', sets: 3, reps: '10-12', description: 'Isolate the hamstrings' },
      { id: 4, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Glute and quad focus' },
      { id: 5, name: 'Leg Extensions', sets: 3, reps: '12-15', description: 'Lock out at the top' },
      { id: 6, name: 'Calf Raises', sets: 4, reps: '15-20', description: 'Full squeeze at the top' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Stretch quads, glutes and calves' },
    ],
  },
  FULL_BODY: {
    title: 'FULL BODY',
    subtitle: 'Balanced compound strength',
    image: require('./Images/FullBodyImage.jpg'),
    exercises: [
      { id: 1, name: 'Warmup', sets: 1, reps: 'N/A', description: 'Jump rope or rower with dynamic mobility' },
      { id: 2, name: 'Barbell Deadlift', sets: 4, reps: '5-8', description: 'Heavy pull with a neutral spine' },
      { id: 3, name: 'Pull-ups', sets: 3, reps: 'Max', description: 'Back and arms' },
      { id: 4, name: 'Bench Press', sets: 4, reps: '6-10', description: 'Explosive press with control' },
      { id: 5, name: 'Walking Lunges', sets: 3, reps: '20 steps', description: 'Legs and glutes' },
      { id: 6, name: 'Overhead Press', sets: 3, reps: '10-12', description: 'Shoulder strength and stability' },
      { id: 7, name: 'Cool Down', sets: 1, reps: 'N/A', description: 'Full-body stretch and foam rolling' },
    ],
  },
  REST_DAY: {
    title: 'REST DAY',
    subtitle: 'Recovery, mobility and recharge',
    image: require('./Images/FullBodyImage.jpg'),
    exercises: [
      { id: 1, name: 'Rest and Recover', sets: 'N/A', reps: 'N/A', description: 'Take the day off and let your body rebuild.' },
      { id: 2, name: 'Optional Light Stretching', sets: 1, reps: '10-15 min', description: 'Gentle mobility to stay loose.' },
      { id: 3, name: 'Optional Easy Walk', sets: 1, reps: '20-30 min', description: 'A light walk to improve circulation.' },
    ],
  },
};

const normalizeCopy = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u201c/g, '-')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizedAlternatives = Object.fromEntries(
  Object.entries(exerciseAlternatives).map(([name, alternatives]) => [
    normalizeCopy(name),
    alternatives.map((alternative) => normalizeCopy(alternative)),
  ])
);

const normalizeWorkoutPlan = (plan) => {
  if (!plan) {
    return null;
  }

  return {
    ...plan,
    title: normalizeCopy(plan.title),
    subtitle: normalizeCopy(plan.subtitle),
    exercises: plan.exercises.map((exercise) => ({
      ...exercise,
      name: normalizeCopy(exercise.name),
      description: normalizeCopy(exercise.description),
    })),
  };
};

const buildWorkoutStorageKey = (workoutType, dayLabel) =>
  `workout_plan_${(workoutType || 'unknown').replace(/[^a-z0-9]/gi, '_')}_${(dayLabel || 'day').replace(/[^a-z0-9]/gi, '_')}`;

const buildSwapOptions = (basePlan, currentPlan, index) => {
  if (!basePlan || index === null || index === undefined) {
    return [];
  }

  const originalName = basePlan.exercises?.[index]?.name;
  const currentName = currentPlan?.exercises?.[index]?.name;

  return Array.from(
    new Set(
      [
        originalName,
        ...(normalizedAlternatives[originalName] || []),
        ...(normalizedAlternatives[currentName] || []),
      ]
        .map((item) => normalizeCopy(item))
        .filter((item) => item && item !== currentName)
    )
  );
};

export default function WorkoutModern() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutType, dayLabel } = route.params || {};
  const key = workoutType?.replace(/[\s-]/g, '_').toUpperCase();
  const storageKey = useMemo(
    () => buildWorkoutStorageKey(workoutType, dayLabel),
    [dayLabel, workoutType]
  );

  const basePlan = useMemo(() => normalizeWorkoutPlan(workoutPlans[key] || null), [key]);
  const [plan, setPlan] = useState(basePlan);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStoredPlan = async () => {
      if (!basePlan) {
        if (isMounted) {
          setPlan(null);
        }
        return;
      }

      try {
        const storedPlan = await AsyncStorage.getItem(storageKey);

        if (!storedPlan) {
          if (isMounted) {
            setPlan(basePlan);
          }
          return;
        }

        const parsedPlan = JSON.parse(storedPlan);
        const mergedExercises = basePlan.exercises.map((exercise, index) => ({
          ...exercise,
          ...(parsedPlan?.exercises?.[index] || {}),
          id: exercise.id,
        }));

        if (isMounted) {
          setPlan({ ...basePlan, exercises: mergedExercises });
        }
      } catch (error) {
        console.error('Could not load saved workout swaps:', error);
        if (isMounted) {
          setPlan(basePlan);
        }
      } finally {
        if (isMounted) {
          setModalVisible(false);
          setSelectedExercise(null);
          setSelectedIndex(null);
        }
      }
    };

    loadStoredPlan();

    return () => {
      isMounted = false;
    };
  }, [basePlan, storageKey]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
    setSelectedIndex(null);
  };

  const persistPlan = async (nextPlan) => {
    setPlan(nextPlan);

    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          exercises: nextPlan.exercises.map(({ name, sets, reps, description }) => ({
            name,
            sets,
            reps,
            description,
          })),
        })
      );
    } catch (error) {
      console.error('Could not persist workout swaps:', error);
    }
  };

  const handleBackPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'gym',
        params: dayLabel ? { focusDay: dayLabel } : undefined,
      })
    );
  };

  if (!plan) {
    return (
      <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
        <AnimatedScreenView style={styles.centeredState}>
          <Text style={styles.emptyTitle}>No workout found</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleBackPress}>
            <Text style={styles.primaryButtonText}>Back to training</Text>
          </TouchableOpacity>
        </AnimatedScreenView>
      </FuturisticBackdrop>
    );
  }

  const handleOpenModal = (name, index) => {
    const availableOptions = buildSwapOptions(basePlan, plan, index);

    if (availableOptions.length === 0) {
      return;
    }

    setSelectedExercise(name);
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleSwap = (altName) => {
    if (selectedIndex === null) {
      return;
    }

    const updated = [...plan.exercises];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      name: altName,
      description: `Alternative to ${selectedExercise}`,
    };
    persistPlan({ ...plan, exercises: updated });
    closeModal();
  };

  const resetPlan = async () => {
    setPlan(basePlan);

    try {
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Could not clear workout swaps:', error);
    }
  };

  const isRestDay = key === 'REST_DAY';
  const swapOptions =
    selectedIndex === null ? [] : buildSwapOptions(basePlan, plan, selectedIndex);

  return (
    <FuturisticBackdrop source={require('./Images/gymPhoto.jpg')}>
      <AnimatedScreenView style={styles.screen}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={22} color="#f5fffb" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <Image source={plan.image} style={styles.heroImage} />
            <View style={styles.heroShade} />
            <View style={styles.heroContent}>
              <View style={styles.heroChipRow}>
                <View style={styles.heroChip}>
                  <Text style={styles.heroChipText}>{dayLabel || 'Workout'}</Text>
                </View>
                <View style={styles.heroChipMuted}>
                  <Text style={styles.heroChipMutedText}>
                    {isRestDay ? 'Recovery' : `${plan.exercises.length} blocks`}
                  </Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{plan.title}</Text>
              <Text style={styles.heroSubtitle}>{plan.subtitle}</Text>
            </View>
          </View>

          {isRestDay ? (
            <View style={styles.panel}>
              <View style={styles.recoveryCard}>
                <Text style={styles.recoveryTitle}>Recovery matters</Text>
                <Text style={styles.recoveryText}>
                  Keep the pace soft today. Sleep well, hydrate, get some steps in, and let the next session feel sharp.
                </Text>
              </View>

              {plan.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.restItemCard}>
                  <Text style={styles.restItemName}>{exercise.name}</Text>
                  <Text style={styles.restItemMeta}>
                    {exercise.sets === 'N/A' ? 'Recovery block' : `${exercise.sets} round - ${exercise.reps}`}
                  </Text>
                  <Text style={styles.restItemDescription}>{exercise.description}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.panel}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Exercises</Text>
                <Text style={styles.sectionHint}>Tap a movement to swap it</Text>
              </View>

              {plan.exercises.map((exercise, index) => {
                const swapAvailable = buildSwapOptions(basePlan, plan, index).length > 0;

                return (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    activeOpacity={swapAvailable ? 0.9 : 1}
                    onPress={() => handleOpenModal(exercise.name, index)}
                  >
                    <View style={styles.exerciseIndexWrap}>
                      <View style={styles.exerciseIndex}>
                        <Text style={styles.exerciseIndexText}>{exercise.id}</Text>
                      </View>
                      {index < plan.exercises.length - 1 ? <View style={styles.exerciseRail} /> : null}
                    </View>

                    <View style={styles.exerciseContent}>
                      <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        {swapAvailable ? (
                          <View style={styles.swapChip}>
                            <Ionicons name="sync-outline" size={14} color="#9dffe0" />
                            <Text style={styles.swapChipText}>Swap</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.exerciseMeta}>{`Sets ${exercise.sets}  -  Reps ${exercise.reps}`}</Text>
                      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={resetPlan}>
            <Ionicons name="refresh-outline" size={18} color="#05120d" />
            <Text style={styles.primaryButtonText}>Reset workout</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalTopRow}>
                <View>
                  <Text style={styles.modalKicker}>EXERCISE SWAP</Text>
                  <Text style={styles.modalTitle}>{selectedExercise}</Text>
                </View>
                <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
                  <Ionicons name="close" size={18} color="#f5fffb" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={swapOptions}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => handleSwap(item)}>
                    <View style={styles.modalOptionIcon}>
                      <Ionicons name="sparkles-outline" size={15} color="#9dffe0" />
                    </View>
                    <View style={styles.modalOptionContent}>
                      <Text style={styles.modalOptionText}>{item}</Text>
                      <Text style={styles.modalOptionHint}>Tap to replace this movement</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#8ca59d" />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </AnimatedScreenView>
    </FuturisticBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContent: {
    paddingTop: 56,
    paddingBottom: 56,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(8, 14, 23, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    height: 230,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(10, 14, 22, 0.66)',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 9, 16, 0.44)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
  },
  heroChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#6ff7c7',
    marginRight: 8,
  },
  heroChipText: {
    color: '#04140e',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroChipMuted: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(8, 15, 23, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroChipMutedText: {
    color: '#d8e6e1',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#f5fffb',
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroSubtitle: {
    marginTop: 8,
    color: '#d2dfdb',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: '84%',
  },
  panel: {
    padding: 16,
    borderRadius: 28,
    backgroundColor: 'rgba(10, 15, 23, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#f5fffb',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionHint: {
    color: '#8ca59d',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseCard: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  exerciseIndexWrap: {
    width: 36,
    alignItems: 'center',
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff6b63',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  exerciseIndexText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  exerciseRail: {
    width: 2,
    flex: 1,
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  exerciseContent: {
    flex: 1,
    marginLeft: 10,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseName: {
    flex: 1,
    color: '#f7fefb',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 10,
  },
  swapChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(111, 247, 199, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(111, 247, 199, 0.25)',
  },
  swapChipText: {
    color: '#9dffe0',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  exerciseMeta: {
    color: '#c7d7d1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  exerciseDescription: {
    color: '#8fa39d',
    fontSize: 13,
    lineHeight: 20,
  },
  recoveryCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(111, 247, 199, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(111, 247, 199, 0.2)',
    marginBottom: 16,
  },
  recoveryTitle: {
    color: '#f5fffb',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  recoveryText: {
    color: '#bad1ca',
    fontSize: 14,
    lineHeight: 22,
  },
  restItemCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  restItemName: {
    color: '#f5fffb',
    fontSize: 18,
    fontWeight: '700',
  },
  restItemMeta: {
    color: '#9dffe0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  restItemDescription: {
    color: '#afc0ba',
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 18,
    alignSelf: 'center',
    minWidth: 184,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#6ff7c7',
  },
  primaryButtonText: {
    color: '#05120d',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 13, 0.72)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    maxHeight: '72%',
    borderRadius: 28,
    padding: 18,
    backgroundColor: 'rgba(9, 14, 22, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalKicker: {
    color: '#9dffe0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  modalTitle: {
    color: '#f6fffb',
    fontSize: 24,
    fontWeight: '800',
    maxWidth: 250,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
  },
  modalOptionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(111, 247, 199, 0.1)',
    marginRight: 12,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionText: {
    color: '#f5fffb',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOptionHint: {
    color: '#8ca59d',
    fontSize: 12,
    marginTop: 4,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#f5fffb',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
});
