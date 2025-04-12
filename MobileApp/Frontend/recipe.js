import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const MealDetailsScreen = ({ route }) => {
  const { meal } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={meal.image} style={styles.image} />
      <Text style={styles.title}>{meal.name}</Text>
      <Text style={styles.calories}>{meal.calories} calories</Text>

      <Text style={styles.sectionTitle}>Recipe:</Text>
      <Text style={styles.recipe}>{meal.recipe}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  calories: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  recipe: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
});

export default MealDetailsScreen;
