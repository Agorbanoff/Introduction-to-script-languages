import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Logout: clear token and other stored data, then navigate
  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.clear(); // removes token, email, and all other keys
    } catch (err) {
      console.error('Error clearing storage on logout:', err);
    } finally {
      setLoading(false);
      navigation.navigate('signup');
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(true);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(
        'https://gymax.onrender.com/auth/deleteaccount',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);

      await AsyncStorage.clear();
      navigation.navigate('signup');
    } catch (err) {
      console.error('Delete account error:', err);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/homePagePhoto.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.settingsContainer}>
            <SettingsButton
              icon="person-outline"
              text="Change Username"
              onPress={() => navigation.navigate('changecredentials', { mode: 'username' })}
            />

            <SettingsButton
              icon="lock-closed-outline"
              text="Change Password"
              onPress={() => navigation.navigate('changecredentials', { mode: 'password' })}
            />

            <SettingsButton
              icon="fitness-outline"
              text="Change Workout Plan"
              onPress={() => navigation.navigate('status')}
            />

            <SettingsButton
              icon="log-out-outline"
              text="Log out"
              onPress={handleLogout}
            />

            <SettingsButton
              icon="trash-outline"
              text="Delete Account"
              onPress={handleDeleteAccount}
            />

            {confirmDelete && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  Deleting your account cannot be undone.{"\n"}
                  Are you sure you want to continue?
                </Text>
                <View style={styles.confirmRow}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Continue</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={cancelDelete}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'gym' }] })}>
          <Ionicons name="barbell-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'diet' }] })}>
          <Ionicons name="restaurant-outline" size={28} color="#1db344" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('calorieinput')}>
          <Ionicons name="barcode-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'settings' }] })}>
          <Ionicons name="settings-outline" size={28} color="#1db344" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingsButton({ icon, text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={24} color="black" />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
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
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  warningContainer: {
    width: '80%',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  warningText: {
    color: '#FFA500',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#555',
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
