import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
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
    
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
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
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
    justifyContent: 'flex-end',
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
