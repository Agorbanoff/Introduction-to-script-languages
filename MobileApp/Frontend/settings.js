import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/homePagePhoto.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.settingsContainer}>
            <SettingsButton icon="person-outline" text="Change Username" onPress={() => console.log('Change Username')} />
            <SettingsButton icon="lock-closed-outline" text="Change Password" onPress={() => console.log('Change Password')} />
            <SettingsButton icon="fitness-outline" text="Change Workout Plan" onPress={() => console.log('Change Workout Plan')} />
            <SettingsButton icon="trash-outline" text="Delete Account" onPress={() => console.log('Delete Account')} />
            <SettingsButton icon="trash-outline" text="Log out" onPress={() => navigation.navigate('signup')} />
          </View>

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
    </View>
  );
};

const SettingsButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Ionicons name={icon} size={24} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

export default SettingsScreen;

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
  settingsContainer: {
    flexGrow: 1,
    justifyContent: 'center',  
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1db344',
    paddingVertical: 20,  
    paddingHorizontal: 40,  
    borderRadius: 10,
    marginBottom: 15, 
    alignItems: 'center',
    width: '80%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,  
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    color: 'black',
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