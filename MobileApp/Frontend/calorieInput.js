// calorieInput.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.8;

export default function CalorieInput() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>FOOD LOG</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ManualEntry')}
        >
          <Ionicons name="pencil-outline" size={48} color="#1db344" />
          <Text style={styles.cardText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'gym' }] })}>
          <Ionicons name="barbell-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'diet' }] })}>
          <Ionicons name="restaurant-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'calorieinput' }] })}>
          <Ionicons name="barcode-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'settings' }] })}>
          <Ionicons name="settings-outline" size={28} color="#1db344" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.4,
    backgroundColor: '#222',
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
    fontWeight: '500',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});
