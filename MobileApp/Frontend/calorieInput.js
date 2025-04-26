// CalorieInput.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const CARD_SIZE    = width * 0.8;
const CHART_WIDTH  = width - 32;
const INITIAL_GOAL = 2000;

export default function CalorieInput() {
  const navigation = useNavigation();

  // State
  const [goalCalories]               = useState(INITIAL_GOAL);
  const [consumedCalories, setConsumed] = useState(1738);
  const [manualMode, setManualMode]     = useState(false);
  const [query, setQuery]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [message, setMessage]           = useState('');

  // Handlers
  const startManual = () => {
    setError('');
    setMessage('');
    setQuery('');
    setManualMode(true);
  };

  const submitManual = async () => {
    if (!query.trim()) {
      setError('Please type something.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://gymax.onrender.com/food/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Server error');
      }
      setMessage(data.message || '');
      // extract calories from message
      const m = data.message.match(/Calories:\s*([0-9]+)/i);
      if (m) setConsumed(parseInt(m[1], 10));
      // remain in manualMode so user sees breakdown
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const remainingCalories = Math.max(goalCalories - consumedCalories, 0);
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
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>FOOD LOG</Text>

        <PieChart
          data={pieData}
          width={CHART_WIDTH}
          height={220}
          chartConfig={chartConfig}
          accessor="calories"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute
          hasLegend
        />

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {manualMode ? (
          <View style={styles.manualContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3 bananas with 1 kiwi"
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              multiline
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={submitManual}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get Calories</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelLink}
              onPress={() => setManualMode(false)}
              disabled={loading}
            >
              <Text style={styles.cancelText}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.card} onPress={startManual}>
              <Ionicons name="pencil-outline" size={48} color="#1db344" />
              <Text style={styles.cardText}>Enter Manually</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'gym' }] })
          }
        >
          <Ionicons name="barbell-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'diet' }] })
          }
        >
          <Ionicons name="restaurant-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'calorieinput' }] })
          }
        >
          <Ionicons name="barcode-outline" size={28} color="#1db344" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'settings' }] })
          }
        >
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
  },
  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 80, // leave space for nav bar
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: CHART_WIDTH,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    marginTop: 32,
  },
  manualContainer: {
    marginTop: 24,
    width: CHART_WIDTH,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#1db344',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  error: {
    color: '#f33',
    marginTop: 8,
    textAlign: 'center',
  },
  cancelLink: {
    marginTop: 12,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.4,
    backgroundColor: '#222',
    borderRadius: 12,
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
