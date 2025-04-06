import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const meals = {
  breakfast: [
    { name: 'Quinoa Pudding', image: require('./Images/breakfast1.png'), calories: '449' },
    { name: 'Protein Breakfast Cake', image: require('./Images/breakfast2.png'), calories: '407' },
    { name: 'Overnight Chocolate Pudding', image: require('./Images/breakfast3.png'), calories: '388' },
    { name: 'Fruit Yogurt', image: require('./Images/breakfast4.png'), calories: '320' },
    { name: 'Avocado Toast', image: require('./Images/breakfast5.png'), calories: '290' },
  ],
  lunch: [
    { name: 'Chicken Salad', image: require('./Images/lunch1.png'), calories: '510' },
    { name: 'Grilled Cheese Sandwich', image: require('./Images/lunch2.png'), calories: '470' },
    { name: 'Vegetable Stir Fry', image: require('./Images/lunch3.png'), calories: '350' },
    { name: 'Pasta Primavera', image: require('./Images/lunch4.png'), calories: '410' },
    { name: 'Beef Taco', image: require('./Images/lunch5.png'), calories: '390' },
  ],
  dinner: [
    { name: 'Steak with Asparagus', image: require('./Images/dinner1.png'), calories: '400' },
    { name: 'Salmon and Potatoes', image: require('./Images/dinner2.png'), calories: '450' },
    { name: 'Chicken Parmesan', image: require('./Images/dinner3.png'), calories: '500' },
    { name: 'Tofu Stir Fry', image: require('./Images/dinner4.png'), calories: '430' },
    { name: 'Pork Chops with Apples', image: require('./Images/dinner5.png'), calories: '600' },
  ],
  snack: [
    { name: 'Mixed Nuts', image: require('./Images/snack1.png'), calories: '200' },
    { name: 'Greek Yogurt', image: require('./Images/snack2.png'), calories: '180' },
    { name: 'Cheese and Crackers', image: require('./Images/snack3.png'), calories: '220' },
    { name: 'Fruit Salad', image: require('./Images/snack4.png'), calories: '150' },
    { name: 'Dark Chocolate', image: require('./Images/snack5.png'), calories: '230' },
  ],
};

const DietPlanScreen = ({ navigation }) => {
  const navigateToDetails = (meal) => {
    console.log('Navigate to:', meal.name); // Placeholder for navigation
  };

  const renderMealCategory = (category) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.mealTypeHeader}>{category.toUpperCase()}</Text>
      <FlatList
        horizontal
        data={meals[category]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dishCard}
            onPress={() => navigateToDetails(item)}
          >
            <Image source={item.image} style={styles.dishImage} />
            <Text style={styles.dishText}>{item.name}</Text>
            <Text style={styles.calories}>{item.calories} calories</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${category}-${item.name}`}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ImageBackground
      source={require('./Images/homePagePhoto.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.scrollView}>
          {renderMealCategory('breakfast')}
          {renderMealCategory('lunch')}
          {renderMealCategory('dinner')}
          {renderMealCategory('snack')}
        </ScrollView>
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
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  mealTypeHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    color: '#1db344',
    textAlign: 'center',
  },
  dishCard: {
    backgroundColor: '#fff',
    width: 160,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    alignItems: 'center',
  },
  dishImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  dishText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  calories: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
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
