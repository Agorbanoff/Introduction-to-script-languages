import React, { useState } from 'react'; 
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const allergensList = [
  'Peanuts',
  'Tree Nuts (almonds, walnuts, cashews, hazelnuts, pecans, pistachios)',
  'Milk',
  'Eggs',
  'Fish (salmon, tuna, cod)',
  'Crustaceans (shrimp, crab, lobster)',
  'Mollusks (clams, mussels, oysters)',
  'Wheat',
  'Soy',
  'Sesame',
  'Mustard',
  'Celery',
  'Lupin',
  'Sulfites',
  'Gluten',
  'Corn',
  'Sunflower seeds',
  'Poppy seeds',
  'Kiwi',
  'Banana',
];

const DietScreen = ({ navigation }) => {
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const toggleAllergen = (item) => {
    setSelectedAllergens((prev) =>
      prev.includes(item)
        ? prev.filter((a) => a !== item)
        : [...prev, item]
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/homePagePhoto.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Select your allergens</Text>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.allergensContainer}
              showsVerticalScrollIndicator={true}
            >
              {allergensList.map((item, index) => {
                const isSelected = selectedAllergens.includes(item);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.allergenButton,
                      isSelected && styles.allergenSelected,
                    ]}
                    onPress={() => toggleAllergen(item)}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={isSelected ? 'white' : '#ccc'}
                      style={styles.icon}
                    />
                    <Text
                      style={[
                        styles.allergenText,
                        isSelected && { color: 'white' },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('diet')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: '#1db344',
    fontSize: 24,
    marginBottom: 20,
    marginTop: 25,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  allergensContainer: {
    paddingRight: 5,
    paddingBottom: 100,
  },
  allergenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  allergenSelected: {
    backgroundColor: '#1db344',
  },
  allergenText: {
    color: '#ccc',
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  icon: {
    marginRight: 8,
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
  continueButton: {
    backgroundColor: '#1db344',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 55, 
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default DietScreen;
