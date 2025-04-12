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
      fat: '15g',
      carbs: '30g',
      protein: '25g',
      time: '10 minutes',
      ingredients: ['2 eggs', '1 handful spinach', '2 slices toast', 'salt', 'pepper'],
      recipe: '1. Beat the eggs.\n2. Sauté spinach.\n3. Cook eggs with spinach.\n4. Toast the bread.\n5. Serve together.',
      alternatives: [
        { ingredient: 'eggs', alternative: 'mashed banana or flaxseed' },
        { ingredient: 'gluten', alternative: 'gluten-free toast' },
      ],
    },
    {
      name: 'Greek Yogurt with Mixed Nuts and Honey',
      image: require('./Images/breakfast2.png'),
      calories: '407',
      fat: '12g',
      carbs: '35g',
      protein: '22g',
      time: '5 minutes',
      ingredients: ['1 cup Greek yogurt', 'mixed nuts', '1 tbsp honey'],
      recipe: '1. Add Greek yogurt in bowl.\n2. Top with nuts.\n3. Drizzle honey.\n4. Chill and serve.',
      alternatives: [
        { ingredient: 'milk', alternative: 'soy or almond yogurt' },
        { ingredient: 'nuts', alternative: 'sunflower seeds' },
      ],
    },
    {
      name: 'Avocado Toast with Poached Eggs',
      image: require('./Images/breakfast3.png'),
      calories: '388',
      fat: '18g',
      carbs: '28g',
      protein: '20g',
      time: '10 minutes',
      ingredients: ['2 slices bread', '1 avocado', '2 eggs'],
      recipe: '1. Toast bread.\n2. Mash avocado.\n3. Poach eggs.\n4. Layer avocado and egg on toast.',
      alternatives: [
        { ingredient: 'eggs', alternative: 'tofu scramble' },
        { ingredient: 'gluten', alternative: 'rice cakes' },
      ],
    },
    {
      name: 'Cottage Cheese with Fresh Fruit',
      image: require('./Images/breakfast4.png'),
      calories: '320',
      fat: '8g',
      carbs: '25g',
      protein: '28g',
      time: '5 minutes',
      ingredients: ['1 cup cottage cheese', '1/2 cup fresh fruit', '1 tsp honey (optional)'],
      recipe: '1. Scoop cottage cheese in bowl.\n2. Add sliced fruits.\n3. Optionally drizzle honey.\n4. Serve fresh.',
      alternatives: [
        { ingredient: 'milk', alternative: 'lactose-free cottage cheese' },
      ],
    },
    {
      name: 'Smoothie Bowl',
      image: require('./Images/breakfast5.png'),
      calories: '290',
      fat: '6g',
      carbs: '40g',
      protein: '10g',
      time: '7 minutes',
      ingredients: ['1 banana', '1/2 cup berries', '1/2 cup milk', 'toppings like seeds or fruit'],
      recipe: '1. Blend banana, berries, milk.\n2. Pour into bowl.\n3. Top with fruits and seeds.\n4. Enjoy cold.',
      alternatives: [
        { ingredient: 'milk', alternative: 'plant milk (almond, oat)' },
        { ingredient: 'seeds', alternative: 'shredded coconut' },
      ],
    },
  ],
  lunch: [
    {
      name: 'Turkey and Avocado Wrap',
      image: require('./Images/lunch1.png'),
      calories: '510',
      fat: '20g',
      carbs: '35g',
      protein: '38g',
      time: '10 minutes',
      ingredients: ['1 tortilla', '3 slices turkey breast', '1/2 avocado', 'lettuce'],
      recipe: '1. Lay out tortilla.\n2. Add turkey, sliced avocado, lettuce.\n3. Wrap and slice.\n4. Serve.',
      alternatives: [
        { ingredient: 'gluten', alternative: 'gluten-free tortilla' },
      ],
    },
    {
      name: 'Quinoa Salad with Grilled Chicken',
      image: require('./Images/lunch2.png'),
      calories: '470',
      fat: '12g',
      carbs: '30g',
      protein: '40g',
      time: '20 minutes',
      ingredients: ['1 cup cooked quinoa', '1 grilled chicken breast', 'chopped vegetables', 'olive oil'],
      recipe: '1. Cook quinoa.\n2. Grill chicken.\n3. Mix with veggies.\n4. Toss with olive oil.\n5. Serve cold or warm.',
      alternatives: [],
    },
    {
      name: 'Lentil Soup',
      image: require('./Images/lunch3.png'),
      calories: '350',
      fat: '4g',
      carbs: '40g',
      protein: '22g',
      time: '30 minutes',
      ingredients: ['1 cup lentils', '1 onion', '1 carrot', '3 cups vegetable broth'],
      recipe: '1. Sauté onion and carrot.\n2. Add lentils and broth.\n3. Simmer until soft.\n4. Season and serve.',
      alternatives: [],
    },
    {
      name: 'Beef and Broccoli Stir Fry',
      image: require('./Images/lunch4.png'),
      calories: '410',
      fat: '16g',
      carbs: '20g',
      protein: '35g',
      time: '15 minutes',
      ingredients: ['200g beef slices', '1 cup broccoli', 'soy sauce', 'garlic'],
      recipe: '1. Sauté beef slices.\n2. Add broccoli.\n3. Stir in soy sauce and garlic.\n4. Serve hot.',
      alternatives: [
        { ingredient: 'soy', alternative: 'coconut aminos' },
      ],
    },
    {
      name: 'Salmon Salad',
      image: require('./Images/lunch5.png'),
      calories: '390',
      fat: '18g',
      carbs: '10g',
      protein: '35g',
      time: '15 minutes',
      ingredients: ['1 salmon fillet', 'mixed greens', 'salad dressing'],
      recipe: '1. Grill or bake salmon.\n2. Prepare salad base.\n3. Flake salmon on top.\n4. Add dressing.',
      alternatives: [
        { ingredient: 'fish', alternative: 'grilled tofu or chickpeas' },
      ],
    },
  ],
  dinner: [
    {
      name: 'Baked Cod with Sweet Potato Fries',
      image: require('./Images/dinner1.png'),
      calories: '400',
      fat: '14g',
      carbs: '30g',
      protein: '35g',
      time: '25 minutes',
      ingredients: ['1 cod fillet', '1 medium sweet potato', 'olive oil', 'lemon', 'salt'],
      recipe: '1. Season cod.\n2. Bake with lemon.\n3. Cut and bake sweet potatoes.\n4. Serve together.',
      alternatives: [
        { ingredient: 'fish', alternative: 'zucchini patties or tofu' },
      ],
    },
    {
      name: 'Chicken Parmesan over Whole Wheat Pasta',
      image: require('./Images/dinner2.png'),
      calories: '450',
      fat: '16g',
      carbs: '40g',
      protein: '38g',
      time: '30 minutes',
      ingredients: ['1 chicken breast', 'whole wheat pasta', 'marinara sauce', 'mozzarella cheese'],
      recipe: '1. Bread and bake chicken.\n2. Add marinara and cheese.\n3. Cook pasta.\n4. Combine and serve.',
      alternatives: [
        { ingredient: 'gluten', alternative: 'rice pasta' },
        { ingredient: 'milk', alternative: 'vegan cheese' },
      ],
    },
    {
      name: 'Vegetable Stir Fry with Tofu',
      image: require('./Images/dinner3.png'),
      calories: '500',
      fat: '18g',
      carbs: '35g',
      protein: '28g',
      time: '15 minutes',
      ingredients: ['1 block tofu', 'mixed vegetables', 'soy sauce'],
      recipe: '1. Sauté tofu until golden.\n2. Add chopped vegetables.\n3. Stir in soy sauce.\n4. Serve warm.',
      alternatives: [
        { ingredient: 'soy', alternative: 'chickpea-based tofu' },
      ],
    },
    {
      name: 'Pork Tenderloin with Roasted Vegetables',
      image: require('./Images/dinner4.png'),
      calories: '430',
      fat: '20g',
      carbs: '22g',
      protein: '40g',
      time: '35 minutes',
      ingredients: ['1 pork tenderloin', 'mixed vegetables', 'olive oil', 'herbs'],
      recipe: '1. Roast pork tenderloin.\n2. Cut veggies and roast with herbs.\n3. Serve with meat slices.',
      alternatives: [],
    },
    {
      name: 'Stuffed Bell Peppers',
      image: require('./Images/dinner5.png'),
      calories: '600',
      fat: '22g',
      carbs: '45g',
      protein: '35g',
      time: '40 minutes',
      ingredients: ['2 bell peppers', '1/2 cup cooked rice', 'minced beef', 'herbs'],
      recipe: '1. Cut and clean peppers.\n2. Stuff with rice, beef, herbs.\n3. Bake for 30 min.\n4. Serve hot.',
      alternatives: [],
    },
  ],
  snack: [
    {
      name: 'Hummus with Carrot and Celery Sticks',
      image: require('./Images/snack1.png'),
      calories: '200',
      fat: '10g',
      carbs: '18g',
      protein: '6g',
      time: '5 minutes',
      ingredients: ['3 tbsp hummus', '1 carrot', '1 celery stalk'],
      recipe: '1. Slice carrots and celery.\n2. Serve with hummus on side.\n3. Dip and enjoy.',
      alternatives: [
        { ingredient: 'sesame', alternative: 'white bean dip' },
      ],
    },
    {
      name: 'Mixed Nuts and Dried Fruits',
      image: require('./Images/snack2.png'),
      calories: '180',
      fat: '14g',
      carbs: '12g',
      protein: '5g',
      time: '2 minutes',
      ingredients: ['handful of mixed nuts', 'handful of dried fruit'],
      recipe: '1. Mix nuts and dried fruits in a bowl.\n2. Portion as desired.\n3. Store in airtight container.',
      alternatives: [
        { ingredient: 'nuts', alternative: 'roasted chickpeas' },
      ],
    },
    {
      name: 'Greek Yogurt with Pumpkin Seeds',
      image: require('./Images/snack3.png'),
      calories: '220',
      fat: '8g',
      carbs: '15g',
      protein: '16g',
      time: '3 minutes',
      ingredients: ['1 cup Greek yogurt', '1 tbsp pumpkin seeds'],
      recipe: '1. Spoon Greek yogurt into bowl.\n2. Top with pumpkin seeds.\n3. Chill and enjoy.',
      alternatives: [
        { ingredient: 'milk', alternative: 'coconut yogurt' },
        { ingredient: 'seeds', alternative: 'toasted oats' },
      ],
    },
    {
      name: 'Protein Bar',
      image: require('./Images/snack4.png'),
      calories: '150',
      fat: '5g',
      carbs: '17g',
      protein: '20g',
      time: '1 minute',
      ingredients: ['1 protein bar'],
      recipe: '1. Unwrap protein bar.\n2. Eat.\n3. Gain muscles.',
      alternatives: [
        { ingredient: 'milk', alternative: 'dairy-free protein bar' },
        { ingredient: 'soy', alternative: 'pea protein bar' },
        { ingredient: 'nuts', alternative: 'seed-based bar' },
      ],
    },
    {
      name: 'Apple Slices with Almond Butter',
      image: require('./Images/snack5.png'),
      calories: '230',
      fat: '12g',
      carbs: '25g',
      protein: '4g',
      time: '4 minutes',
      ingredients: ['1 apple', '1 tbsp almond butter'],
      recipe: '1. Slice apples.\n2. Spread almond butter.\n3. Enjoy as snack.',
      alternatives: [
        { ingredient: 'nuts', alternative: 'sunflower seed butter' },
      ],
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
