import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AnimatedScreenView from './AnimatedScreenView';
import FloatingNavBar from './FloatingNavBar';
import { BASE_API } from './apiConfig';
import { authFetch } from './authFetch';
import { clearTokens, ensureAccessToken } from './authManager';

export default function SettingsScreen({ navigation }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Logout: clear token and other stored data, then navigate
  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = await ensureAccessToken();
      if (token) {
        await authFetch(`${BASE_API}/auth/logout`, { method: 'POST' });
      }
      await clearTokens();
      await AsyncStorage.clear(); // removes token, email, and all other keys
    } catch (err) {
      console.error('Error clearing storage on logout:', err);
    } finally {
      setLoading(false);
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'signup' }], // replace with your login screen name
        })
      );
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
      const token = await ensureAccessToken();
      if (!token) throw new Error('Not authenticated');

      const res = await authFetch(`${BASE_API}/auth/deleteaccount`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);

      await clearTokens();
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
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowSide]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <AnimatedScreenView style={styles.overlay}>
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
              <View style={styles.warningIconWrap}>
                <Ionicons name="warning-outline" size={22} color="#ffb074" />
              </View>
              <Text style={styles.warningTitle}>Delete account</Text>
              <Text style={styles.warningText}>
                This permanently removes your profile, saved progress, and account access.
              </Text>
              <Text style={styles.warningSubtext}>
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
      </AnimatedScreenView>

      <FloatingNavBar navigation={navigation} activeRoute="settings" />
    </View>
  );
}

function SettingsButton({ icon, text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#9dffe0" />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#06090d' },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 110,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  glowTop: {
    width: 240,
    height: 240,
    top: -30,
    right: -80,
    backgroundColor: '#39d79d',
  },
  glowSide: {
    width: 190,
    height: 190,
    top: '38%',
    left: -70,
    backgroundColor: '#5d8cff',
    opacity: 0.16,
  },
  glowBottom: {
    width: 200,
    height: 200,
    bottom: 110,
    left: -70,
    backgroundColor: '#ff715f',
  },
  settingsContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 52,
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    marginLeft: 12,
    fontWeight: '700',
    color: '#f7fffb',
    fontSize: 17,
  },
  warningContainer: {
    width: '100%',
    padding: 18,
    backgroundColor: 'rgba(21, 14, 16, 0.88)',
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 131, 112, 0.18)',
  },
  warningIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 154, 120, 0.12)',
    marginBottom: 12,
  },
  warningTitle: {
    color: '#fff5ef',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  warningText: {
    color: '#ffd2bd',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  warningSubtext: {
    color: '#fff5ef',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#ef5148',
    paddingVertical: 13,
    borderRadius: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '800',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 13,
    borderRadius: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f7fffb',
    fontWeight: '800',
  },
});
