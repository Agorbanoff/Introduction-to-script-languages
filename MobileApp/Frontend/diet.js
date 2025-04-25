import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const bulkingMeals = {
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

const cuttingMeals = {
  breakfast: [
    {
      name: 'Greek Yogurt with Berries & Chia Seeds',
      image: require('./Images/fbreakfast1.png'),
      calories: '250',
      fat: '5g',
      carbs: '18g',
      protein: '20g',
      time: '5 minutes',
      ingredients: ['3/4 cup Greek yogurt', '1/4 cup berries', '1 tsp chia seeds'],
      recipe: '1. Scoop Greek yogurt into a bowl.\n2. Top with berries.\n3. Sprinkle chia seeds.',
      alternatives: [
        { ingredient: 'chia seeds', alternative: 'flax seeds' },
        { ingredient: 'berries', alternative: 'kiwi slices' },
      ],
    },
    {
      name: 'Scrambled Eggs with Spinach and Tomatoes',
      image: require('./Images/fbreakfast2.png'),
      calories: '300',
      fat: '22g',
      carbs: '5g',
      protein: '20g',
      time: '10 minutes',
      ingredients: ['3 eggs', '1/2 cup spinach', '1/4 cup diced tomatoes'],
      recipe: '1. Whisk eggs.\n2. Saute spinach and tomatoes.\n3. Add eggs and scramble.',
      alternatives: [
        { ingredient: 'eggs', alternative: 'egg whites' },
        { ingredient: 'spinach', alternative: 'kale' },
      ],
    },
    {
      name: 'Oatmeal with Cinnamon and Half a Banana',
      image: require('./Images/fbreakfast3.png'),
      calories: '220',
      fat: '3g',
      carbs: '35g',
      protein: '6g',
      time: '7 minutes',
      ingredients: ['1/2 cup rolled oats', '1 cup almond milk', '1/2 banana', '1/4 tsp cinnamon'],
      recipe: '1. Cook oats.\n2. Stir in cinnamon.\n3. Top with banana slices.',
      alternatives: [
        { ingredient: 'banana', alternative: 'berries' },
        { ingredient: 'almond milk', alternative: 'oat milk' },
      ],
    },
    {
      name: 'Protein Smoothie with Spinach & Almond Milk',
      image: require('./Images/fbreakfast4.png'),
      calories: '180',
      fat: '2g',
      carbs: '8g',
      protein: '25g',
      time: '5 minutes',
      ingredients: ['1 scoop protein powder', '1 cup almond milk', '1/2 banana', '1 cup spinach'],
      recipe: '1. Blend all ingredients until smooth.',
      alternatives: [
        { ingredient: 'almond milk', alternative: 'coconut milk' },
        { ingredient: 'spinach', alternative: 'kale' },
      ],
    },
    {
      name: 'Cottage Cheese with Cucumber Slices',
      image: require('./Images/fbreakfast5.png'),
      calories: '160',
      fat: '4g',
      carbs: '6g',
      protein: '22g',
      time: '3 minutes',
      ingredients: ['1/2 cup cottage cheese', '1/2 cucumber'],
      recipe: '1. Place cottage cheese in a bowl.\n2. Add cucumber slices.',
      alternatives: [
        { ingredient: 'cottage cheese', alternative: 'Greek yogurt' },
        { ingredient: 'cucumber', alternative: 'celery' },
      ],
    },
  ],
  lunch: [
    {
      name: 'Grilled Chicken Salad with Olive Oil Dressing',
      image: require('./Images/flunch1.png'),
      calories: '400',
      fat: '18g',
      carbs: '10g',
      protein: '45g',
      time: '15 minutes',
      ingredients: ['1 grilled chicken breast', '2 cups mixed greens', 'cherry tomatoes', 'cucumber', '1 tbsp olive oil'],
      recipe: '1. Grill chicken.\n2. Toss greens, tomatoes, cucumber.\n3. Drizzle olive oil.',
      alternatives: [
        { ingredient: 'olive oil', alternative: 'avocado oil' },
        { ingredient: 'greens', alternative: 'arugula' },
      ],
    },
    {
      name: 'Tuna Lettuce Wraps with Avocado',
      image: require('./Images/flunch2.png'),
      calories: '280',
      fat: '12g',
      carbs: '5g',
      protein: '32g',
      time: '10 minutes',
      ingredients: ['1 can tuna', 'butter lettuce', '1/2 avocado', '1 tbsp Greek yogurt'],
      recipe: '1. Mix tuna with yogurt.\n2. Fill lettuce wraps.\n3. Add avocado slices.',
      alternatives: [
        { ingredient: 'lettuce', alternative: 'cabbage leaves' },
        { ingredient: 'Greek yogurt', alternative: 'light mayo' },
      ],
    },
    {
      name: 'Turkey Breast with Steamed Broccoli & Quinoa',
      image: require('./Images/flunch3.png'),
      calories: '420',
      fat: '12g',
      carbs: '25g',
      protein: '45g',
      time: '20 minutes',
      ingredients: ['1 turkey breast', '1/2 cup quinoa', '1 cup steamed broccoli'],
      recipe: '1. Grill turkey.\n2. Steam broccoli.\n3. Cook quinoa.\n4. Serve together.',
      alternatives: [
        { ingredient: 'quinoa', alternative: 'brown rice' },
        { ingredient: 'broccoli', alternative: 'green beans' },
      ],
    },
    {
      name: 'Egg White Omelette with Mushrooms and Arugula',
      image: require('./Images/flunch4.png'),
      calories: '180',
      fat: '4g',
      carbs: '5g',
      protein: '28g',
      time: '8 minutes',
      ingredients: ['3 egg whites', '1/4 cup mushrooms', '1/2 cup arugula'],
      recipe: '1. Saute mushrooms.\n2. Add egg whites.\n3. Fold with arugula.',
      alternatives: [
        { ingredient: 'arugula', alternative: 'spinach' },
        { ingredient: 'mushrooms', alternative: 'zucchini' },
      ],
    },
    {
      name: 'Grilled Salmon with Cucumber-Tomato Salad',
      image: require('./Images/flunch5.png'),
      calories: '430',
      fat: '22g',
      carbs: '8g',
      protein: '45g',
      time: '20 minutes',
      ingredients: ['1 salmon fillet', 'cucumber', 'cherry tomatoes', 'olive oil'],
      recipe: '1. Grill salmon.\n2. Toss cucumber and tomatoes.\n3. Drizzle olive oil.',
      alternatives: [
        { ingredient: 'salmon', alternative: 'trout' },
        { ingredient: 'olive oil', alternative: 'lemon dressing' },
      ],
    },
  ],
  dinner: [
    {
      name: 'Baked Cod with Asparagus',
      image: require('./Images/fdinner1.png'),
      calories: '350',
      fat: '10g',
      carbs: '6g',
      protein: '40g',
      time: '20 minutes',
      ingredients: ['1 cod fillet', 'asparagus', 'olive oil'],
      recipe: '1. Bake cod and asparagus at 375°F for 15–20 minutes.',
      alternatives: [
        { ingredient: 'cod', alternative: 'tilapia' },
        { ingredient: 'asparagus', alternative: 'green beans' },
      ],
    },
    {
      name: 'Ground Turkey Stir-Fry with Vegetables',
      image: require('./Images/fdinner2.png'),
      calories: '400',
      fat: '14g',
      carbs: '12g',
      protein: '42g',
      time: '15 minutes',
      ingredients: ['4 oz ground turkey', 'mixed veggies', '1 tsp soy sauce'],
      recipe: '1. Saute turkey.\n2. Add veggies.\n3. Stir in soy sauce.',
      alternatives: [
        { ingredient: 'soy sauce', alternative: 'coconut aminos' },
        { ingredient: 'ground turkey', alternative: 'ground chicken' },
      ],
    },
    {
      name: 'Zucchini Noodles with Marinara & Shrimp',
      image: require('./Images/fdinner3.png'),
      calories: '310',
      fat: '8g',
      carbs: '10g',
      protein: '35g',
      time: '12 minutes',
      ingredients: ['zucchini noodles', 'shrimp', 'marinara sauce'],
      recipe: '1. Saute zucchini.\n2. Add marinara sauce.\n3. Top with grilled shrimp.',
      alternatives: [
        { ingredient: 'shrimp', alternative: 'chicken breast' },
        { ingredient: 'zucchini noodles', alternative: 'spaghetti squash' },
      ],
    },
    {
      name: 'Roasted Chicken Breast with Cauliflower Mash',
      image: require('./Images/fdinner4.png'),
      calories: '420',
      fat: '14g',
      carbs: '10g',
      protein: '50g',
      time: '25 minutes',
      ingredients: ['chicken breast', 'cauliflower', 'olive oil'],
      recipe: '1. Roast chicken.\n2. Steam cauliflower.\n3. Blend into mash.',
      alternatives: [
        { ingredient: 'chicken', alternative: 'turkey breast' },
        { ingredient: 'cauliflower', alternative: 'broccoli mash' },
      ],
    },
    {
      name: 'Beef Strips with Sauteed Green Beans',
      image: require('./Images/fdinner5.png'),
      calories: '450',
      fat: '18g',
      carbs: '8g',
      protein: '50g',
      time: '15 minutes',
      ingredients: ['beef strips', 'green beans', 'olive oil'],
      recipe: '1. Saute beef strips.\n2. Add green beans.\n3. Serve hot.',
      alternatives: [
        { ingredient: 'beef', alternative: 'bison' },
        { ingredient: 'green beans', alternative: 'broccoli' },
      ],
    },
  ],
  snack: [
    {
      name: 'Hard-Boiled Eggs',
      image: require('./Images/fsnack1.png'),
      calories: '140',
      fat: '10g',
      carbs: '1g',
      protein: '12g',
      time: '10 minutes',
      ingredients: ['2 eggs'],
      recipe: '1. Boil eggs for 9 minutes.\n2. Cool and peel.',
      alternatives: [
        { ingredient: 'eggs', alternative: 'egg whites' },
      ],
    },
    {
      name: 'Almonds (Small Handful)',
      image: require('./Images/fsnack2.png'),
      calories: '160',
      fat: '14g',
      carbs: '6g',
      protein: '6g',
      time: '0 minutes',
      ingredients: ['15 almonds'],
      recipe: '1. Grab and snack.',
      alternatives: [
        { ingredient: 'almonds', alternative: 'walnuts' },
      ],
    },
    {
      name: 'Celery Sticks with Hummus',
      image: require('./Images/fsnack3.png'),
      calories: '120',
      fat: '7g',
      carbs: '8g',
      protein: '4g',
      time: '5 minutes',
      ingredients: ['celery sticks', 'hummus'],
      recipe: '1. Slice celery.\n2. Dip into hummus.',
      alternatives: [
        { ingredient: 'hummus', alternative: 'Greek yogurt dip' },
      ],
    },
    {
      name: 'Low-Fat Cheese Stick',
      image: require('./Images/fsnack4.png'),
      calories: '80',
      fat: '6g',
      carbs: '1g',
      protein: '7g',
      time: '1 minute',
      ingredients: ['low-fat mozzarella stick'],
      recipe: '1. Grab and eat.',
      alternatives: [
        { ingredient: 'cheese stick', alternative: 'low-fat cheddar cubes' },
      ],
    },
    {
      name: 'Sliced Apple with Peanut Butter',
      image: require('./Images/fsnack5.png'),
      calories: '150',
      fat: '7g',
      carbs: '20g',
      protein: '3g',
      time: '3 minutes',
      ingredients: ['1/2 apple', '1 tsp peanut butter'],
      recipe: '1. Slice apple.\n2. Spread peanut butter.',
      alternatives: [
        { ingredient: 'peanut butter', alternative: 'almond butter' },
      ],
    },
  ],
};


export default function DietPlanScreen({ navigation }) {
  const [bfp, setBfp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState(bulkingMeals); // default bulking

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No access token found');

        const res = await fetch('https://gymax.onrender.com/stats/statistics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { bfp } = await res.json();

        setBfp(bfp);

        if (bfp > 25) {
          setMeals(cuttingMeals);
        } else {
          setMeals(bulkingMeals);
        }
      } catch (err) {
        console.error('Failed to load BFP:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1db344" />
      </View>
    );
  }

  const renderMealCategory = (category) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.mealTypeHeader}>{category.toUpperCase()}</Text>
      <FlatList
        horizontal
        data={meals[category]}
        keyExtractor={(item) => category + item.name}
        showsHorizontalScrollIndicator={false}
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
}

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
