import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const meals = {
  breakfast: ['Oatmeal with fruits', 'Greek yogurt with honey', 'Smoothie bowl'],
  lunch: ['Grilled chicken salad', 'Vegetable stir-fry', 'Quinoa and beans'],
  dinner: ['Baked salmon with veggies', 'Pasta with tomato sauce', 'Tofu curry'],
  snack: ['Nuts and seeds', 'Fruit slices', 'Yogurt'],
};

const DietPlanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/homePagePhoto.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>Diet Plan</Text>
          
          <ScrollView style={styles.scrollView}>
            {Object.entries(meals).map(([mealType, dishes], index) => (
              <View key={index} style={styles.mealSection}>
                <Text style={styles.mealType}>{mealType.toUpperCase()}</Text>
                {dishes.map((dish, dishIndex) => (
                  <TouchableOpacity key={dishIndex} style={styles.dishButton}>
                    <Text style={styles.dishText}>{dish}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Navigation bar */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('gym')}>
              <Ionicons name="barbell-outline" size={28} color="#1db344" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('allergens')}>
              <Ionicons name="restaurant-outline" size={28} color="#1db344" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('settings')}>
              <Ionicons name="settings-outline" size={28} color="#1db344" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
    justifyContent: 'space-between', 
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1db344',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    flex: 1, 
  },
  mealSection: {
    marginBottom: 30,
  },
  mealType: {
    marginLeft: 10,
    color: '#1db344',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dishButton: {
    backgroundColor: '#2e2e2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  dishText: {
    color: 'white',
    fontSize: 16,
  },
  navBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 60,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});

export default DietPlanScreen;
