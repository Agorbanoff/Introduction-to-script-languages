import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import FuturisticBackdrop from './FuturisticBackdrop';

export default function RecipeModern({ route, navigation }) {
  const { meal } = route.params;

  const fat = meal.fat || '6.5g';
  const carbs = meal.carbs || '96.3g';
  const protein = meal.protein || '48.3g';
  const time = meal.time || '20 minutes';
  const ingredients = meal.ingredients || [
    'No ingredients listed. Please update meal object!',
  ];

  const handleBackPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'diet',
      })
    );
  };

  return (
    <FuturisticBackdrop source={meal.image}>
      <View style={styles.screen}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.82}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <Ionicons name="chevron-back" size={22} color="#f5fffb" />
        </TouchableOpacity>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Image source={meal.image} style={styles.image} />

          <View style={styles.card}>
            <Text style={styles.mealTitle}>{meal.name.toUpperCase()}</Text>

            <View style={styles.macroRow}>
              <View style={styles.macroBox}>
                <MaterialCommunityIcons
                  name="water-percent"
                  size={20}
                  color="white"
                />
                <Text style={styles.macroText}>{fat}</Text>
                <Text style={styles.macroLabel}>FAT</Text>
              </View>
              <View style={styles.macroBox}>
                <FontAwesome5 name="bread-slice" size={20} color="white" />
                <Text style={styles.macroText}>{carbs}</Text>
                <Text style={styles.macroLabel}>CARBS</Text>
              </View>
              <View style={styles.macroBox}>
                <FontAwesome5 name="dumbbell" size={20} color="white" />
                <Text style={styles.macroText}>{protein}</Text>
                <Text style={styles.macroLabel}>PROTEIN</Text>
              </View>
            </View>

            <Text style={styles.calories}>{meal.calories} calories</Text>
          </View>

          <View style={styles.timeBox}>
            <Ionicons name="time-outline" size={16} color="#9ba9a5" />
            <Text style={styles.timeText}>{time}</Text>
          </View>

          <Text style={styles.sectionTitle}>INGREDIENTS</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.bullet}>-</Text>
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>RECIPE</Text>
          <Text style={styles.ingredientText}>{meal.recipe}</Text>

          <Text style={styles.sectionTitle}>ALTERNATIVES</Text>
          {meal.alternatives && meal.alternatives.length > 0 ? (
            meal.alternatives.map((item, index) => (
              <Text key={index} style={styles.ingredientText}>
                - {item.ingredient} to {item.alternative}
              </Text>
            ))
          ) : (
            <Text style={styles.ingredientText}>No known alternatives.</Text>
          )}
        </ScrollView>
      </View>
    </FuturisticBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 40,
    paddingTop: 18,
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 32,
  },
  card: {
    backgroundColor: 'rgba(7, 11, 18, 0.84)',
    marginTop: -40,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mealTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  macroLabel: {
    color: '#9ba9a5',
    fontSize: 12,
  },
  calories: {
    color: '#9dffe0',
    fontWeight: '800',
    fontSize: 16,
    marginTop: 5,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  timeText: {
    color: '#9ba9a5',
    marginLeft: 5,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#9dffe0',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#9dffe0',
    fontSize: 16,
    marginRight: 10,
    lineHeight: 22,
  },
  ingredientText: {
    color: 'white',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
});
