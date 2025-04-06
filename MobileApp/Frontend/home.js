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
            Let's get started
          </Text>
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={() => navigation.navigate('gym')}>
              <ImageBackground
                source={require('./Images/gymPhoto.jpg')}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.orText}>or</Text>
            <TouchableOpacity onPress={() => navigation.navigate('allergens')}>
              <ImageBackground
                source={require('./Images/dietPhoto.jpg')}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.chooseText}>To start with</Text>
        </View>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredText: {
    textAlign: 'center',
    color: '#1db344',
    fontSize: 50,
    marginBottom: 50, 
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    borderRadius: 30,
    width: 150,  
    height: 200,
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 40,
    color: '#1db344',
  },
  chooseText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 50,
    color: '#1db344',
    marginBottom: 60,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});