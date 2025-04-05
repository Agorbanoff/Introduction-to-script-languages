import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LongContentScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/homePagePhoto.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.centeredText}>
            Choose where you want to go 
          </Text>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'gym' }],
                })
              }
            >
              <Ionicons name="barbell-outline" size={28} color="#1db344" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'allergens' }],
                })
              }
            >
              <Ionicons name="restaurant-outline" size={28} color="#1db344" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'settings' }],
                })
              }
            >
              <Ionicons name="settings-outline" size={28} color="#1db344" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LongContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
    justifyContent: 'space-between',
  },
  centeredText: {
    marginTop: 100,
    textAlign: 'center',
    color: '#1db344',
    fontSize: 50,
  },
  navBar: {
    height: 60,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});
