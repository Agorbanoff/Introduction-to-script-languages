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

const MealDetailsScreen = ({ route, navigation }) => {
  const { meal } = route.params;

  const fat = meal.fat || '6.5g';
  const carbs = meal.carbs || '96.3g';
  const protein = meal.protein || '48.3g';
  const time = meal.time || '20 minutes';
  const ingredients = meal.ingredients || [
    'No ingredients listed. Please update meal object!',
  ];

  return (
    <ScrollView style={styles.container}>
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

        <Text style={styles.calories}>🔥 {meal.calories} calories</Text>
      </View>

      <View style={styles.timeBox}>
        <Ionicons name="time-outline" size={16} color="gray" />
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <Text style={styles.sectionTitle}>INGREDIENTS</Text>
      {ingredients.map((item, index) => (
        <View key={index} style={styles.ingredientItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.ingredientText}>{item}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>RECIPE</Text>
      <Text style={styles.ingredientText}>{meal.recipe}</Text>

      <Text style={styles.sectionTitle}>ALTERNATIVES</Text>
      {meal.alternatives && meal.alternatives.length > 0 ? (
        meal.alternatives.map((item, index) => (
          <Text key={index} style={styles.ingredientText}>
            • {item.ingredient} → {item.alternative}
          </Text>
        ))
      ) : (
        <Text style={styles.ingredientText}>No known alternatives.</Text>
      )}

      {/* Back Button at Bottom */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={40} color="#1db344" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    backgroundColor: '#1a1a1a',
    marginTop: -40,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  mealTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
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
    fontWeight: 'bold',
    marginTop: 5,
  },
  macroLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  calories: {
    color: '#1db344',
    fontWeight: 'bold',
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
    color: 'gray',
    marginLeft: 5,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#1db344',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#1db344',
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
  backButtonContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
});

export default MealDetailsScreen;
