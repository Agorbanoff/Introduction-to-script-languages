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
    {
      name: 'Scrambled eggs with spinach and toast',
      image: require('./Images/breakfast1.png'),
      calories: '449',
      recipe: '1. Beat the eggs.\n2. Sauté spinach.\n3. Cook eggs with spinach.\n4. Toast the bread.\n5. Serve together.',
    },
    {
      name: 'Greek Yogurt with Mixed Nuts and Honey',
      image: require('./Images/breakfast2.png'),
      calories: '407',
      recipe: '1. Add Greek yogurt in bowl.\n2. Top with nuts.\n3. Drizzle honey.\n4. Chill and serve.',
    },
    {
      name: 'Avocado Toast with Poached Eggs',
      image: require('./Images/breakfast3.png'),
      calories: '388',
      recipe: '1. Toast bread.\n2. Mash avocado.\n3. Poach eggs.\n4. Layer avocado and egg on toast.',
    },
    {
      name: 'Cottage Cheese with Fresh Fruit',
      image: require('./Images/breakfast4.png'),
      calories: '320',
      recipe: '1. Scoop cottage cheese in bowl.\n2. Add sliced fruits.\n3. Optionally drizzle honey.\n4. Serve fresh.',
    },
    {
      name: 'Smoothie Bowl',
      image: require('./Images/breakfast5.png'),
      calories: '290',
      recipe: '1. Blend banana, berries, milk.\n2. Pour into bowl.\n3. Top with fruits and seeds.\n4. Enjoy cold.',
    },
  ],
  lunch: [
    {
      name: 'Turkey and Avocado Wrap',
      image: require('./Images/lunch1.png'),
      calories: '510',
      recipe: '1. Lay out tortilla.\n2. Add turkey, sliced avocado, lettuce.\n3. Wrap and slice.\n4. Serve.',
    },
    {
      name: 'Quinoa Salad with Grilled Chicken',
      image: require('./Images/lunch2.png'),
      calories: '470',
      recipe: '1. Cook quinoa.\n2. Grill chicken.\n3. Mix with veggies.\n4. Toss with olive oil.\n5. Serve cold or warm.',
    },
    {
      name: 'Lentil Soup',
      image: require('./Images/lunch3.png'),
      calories: '350',
      recipe: '1. Sauté onion and carrot.\n2. Add lentils and broth.\n3. Simmer until soft.\n4. Season and serve.',
    },
    {
      name: 'Beef and Broccoli Stir Fry',
      image: require('./Images/lunch4.png'),
      calories: '410',
      recipe: '1. Sauté beef slices.\n2. Add broccoli.\n3. Stir in soy sauce and garlic.\n4. Serve hot.',
    },
    {
      name: 'Salmon Salad',
      image: require('./Images/lunch5.png'),
      calories: '390',
      recipe: '1. Grill or bake salmon.\n2. Prepare salad base.\n3. Flake salmon on top.\n4. Add dressing.',
    },
  ],
  dinner: [
    {
      name: 'Baked Cod with Sweet Potato Fries',
      image: require('./Images/dinner1.png'),
      calories: '400',
      recipe: '1. Season cod.\n2. Bake with lemon.\n3. Cut and bake sweet potatoes.\n4. Serve together.',
    },
    {
      name: 'Chicken Parmesan over Whole Wheat Pasta',
      image: require('./Images/dinner2.png'),
      calories: '450',
      recipe: '1. Bread and bake chicken.\n2. Add marinara and cheese.\n3. Cook pasta.\n4. Combine and serve.',
    },
    {
      name: 'Vegetable Stir Fry with Tofu',
      image: require('./Images/dinner3.png'),
      calories: '500',
      recipe: '1. Sauté tofu until golden.\n2. Add chopped vegetables.\n3. Stir in soy sauce.\n4. Serve warm.',
    },
    {
      name: 'Pork Tenderloin with Roasted Vegetables',
      image: require('./Images/dinner4.png'),
      calories: '430',
      recipe: '1. Roast pork tenderloin.\n2. Cut veggies and roast with herbs.\n3. Serve with meat slices.',
    },
    {
      name: 'Stuffed Bell Peppers',
      image: require('./Images/dinner5.png'),
      calories: '600',
      recipe: '1. Cut and clean peppers.\n2. Stuff with rice, beef, herbs.\n3. Bake for 30 min.\n4. Serve hot.',
    },
  ],
  snack: [
    {
      name: 'Hummus with Carrot and Celery Sticks',
      image: require('./Images/snack1.png'),
      calories: '200',
      recipe: '1. Slice carrots and celery.\n2. Serve with hummus on side.\n3. Dip and enjoy.',
    },
    {
      name: 'Mixed Nuts and Dried Fruits',
      image: require('./Images/snack2.png'),
      calories: '180',
      recipe: '1. Mix nuts and dried fruits in a bowl.\n2. Portion as desired.\n3. Store in airtight container.',
    },
    {
      name: 'Greek Yogurt with Pumpkin Seeds',
      image: require('./Images/snack3.png'),
      calories: '220',
      recipe: '1. Spoon Greek yogurt into bowl.\n2. Top with pumpkin seeds.\n3. Chill and enjoy.',
    },
    {
      name: 'Protein Bar',
      image: require('./Images/snack4.png'),
      calories: '150',
      recipe: '1. Unwrap protein bar.\n2. Eat.\n3. Gain muscles.',
    },
    {
      name: 'Apple Slices with Almond Butter',
      image: require('./Images/snack5.png'),
      calories: '230',
      recipe: '1. Slice apples.\n2. Spread almond butter.\n3. Enjoy as snack.',
    },
  ],
};

const DietPlanScreen = ({ navigation }) => {
  const renderMealCategory = (category) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.mealTypeHeader}>{category.toUpperCase()}</Text>
      <FlatList
        horizontal
        data={meals[category]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dishCard}
            onPress={() => navigation.navigate('recipe', { meal: item })}
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
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
          {renderMealCategory('breakfast')}
          {renderMealCategory('lunch')}
          {renderMealCategory('dinner')}
          {renderMealCategory('snack')}
        </ScrollView>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('gym')}>
            <Ionicons name="barbell-outline" size={28} color="#1db344" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('diet')}>
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
