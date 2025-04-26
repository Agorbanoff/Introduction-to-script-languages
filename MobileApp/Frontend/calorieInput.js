// CalorieInput.js
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
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.8;

// Hard-coded values for demo:
const consumedCalories = 1738;
const goalCalories = 2000;
const remainingCalories = Math.max(goalCalories - consumedCalories, 0);

export default function CalorieInput() {
  const navigation = useNavigation();

  const pieData = [
    {
      name: 'Consumed',
      calories: consumedCalories,
      color: '#FF6384',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
    {
      name: 'Remaining',
      calories: remainingCalories,
      color: '#36A2EB',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundColor: '#111',
    backgroundGradientFrom: '#111',
    backgroundGradientTo: '#111',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>FOOD LOG</Text>

      {/* Pie Chart */}
      <View style={styles.chartWrapper}>
        <PieChart
          data={pieData}
          width={width - 32}      // full width minus padding
          height={220}
          chartConfig={chartConfig}
          accessor="calories"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute               // show raw kcal values
          hasLegend              // show legend
        />
      </View>

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
    marginBottom: 16,
  },
  chartWrapper: {
    marginBottom: 24,
    backgroundColor: '#111',
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
