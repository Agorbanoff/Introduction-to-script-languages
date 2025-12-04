// CalorieInput.js
import React, { useState, useEffect } from 'react';
import { BASE_API } from './apiConfig';
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
import CaloriePieChart from './CaloriePieChart';
// ↓ Import your new token getter instead of AsyncStorage:
import { getAccessToken } from './authManager';

const { width } = Dimensions.get('window');
const CARD_SIZE   = width * 0.4;
const CHART_WIDTH = width - 32;

export default function CalorieInput() {
  const navigation = useNavigation();

  // --- State for goals and logs
  const [goalCalories, setGoalCalories] = useState(2000);
  const [consumedCalories, setConsumed] = useState(0);
  const [loggedFoods, setLoggedFoods] = useState([]);

  // --- Modes
  const [searchMode, setSearchMode] = useState(false);
  const [calcMode, setCalcMode] = useState(false);

  // --- Search entry state
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchEntry, setSearchEntry] = useState(null); // { description, calories }

  // --- Calculator entry state
  const [calsPer100, setCalsPer100] = useState('');
  const [grams, setGrams] = useState('');
  const [calcError, setCalcError] = useState('');
  const [calcEntry, setCalcEntry] = useState(null); // { description, calories }

  // --- BFP loading
  const [bfpLoading, setBfpLoading] = useState(true);

  // Fetch BFP -> goalCalories
  useEffect(() => {
    (async () => {
      try {
        const token = getAccessToken(); 
        if (!token) throw new Error('No access token found');
        const res = await fetch(`${BASE_API}/stats/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { BFP } = await res.json();
        setGoalCalories(BFP > 25 ? 2000 : 2500);
      } catch (err) {
        console.error(err);
        setGoalCalories(2000);
      } finally {
        setBfpLoading(false);
      }
    })();
  }, []);

  // --- Handlers to start modes
  const startSearch = () => {
    setSearchError('');
    setSearchMessage('');
    setQuery('');
    setSearchEntry(null);
    setCalcMode(false);
    setSearchMode(true);
  };
  const startCalc = () => {
    setCalcError('');
    setCalsPer100('');
    setGrams('');
    setCalcEntry(null);
    setSearchMode(false);
    setCalcMode(true);
  };

  // --- Cancel both modes
  const cancelEntry = () => {
    setSearchMode(false);
    setCalcMode(false);
  };

  // --- Search submit
  const submitSearch = async () => {
    if (!query.trim()) {
      setSearchError('Please type something.');
      return;
    }
    setLoading(true);
    setSearchError('');
    try {
      const res = await fetch(
        `${BASE_API}/food/search?query=${encodeURIComponent(query)}`,
        // No token required for public food search, assuming it’s public.
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Server error');
      setSearchMessage(data.message || '');
      const m = data.message.match(/Calories:\s*([0-9]+)/i);
      if (m) {
        const cals = parseInt(m[1], 10);
        setSearchEntry({ description: query.trim(), calories: cals });
      }
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Calculator submit
  const calculateEntry = () => {
    setCalcError('');
    const per100 = parseFloat(calsPer100);
    const g = parseFloat(grams);
    if (isNaN(per100) || per100 <= 0) {
      setCalcError('Enter valid calories/100g.');
      return;
    }
    if (isNaN(g) || g <= 0) {
      setCalcError('Enter valid weight in grams.');
      return;
    }
    const total = Math.round((per100 * g) / 100);
    setCalcEntry({ description: `${g}g at ${per100} kcal/100g`, calories: total });
  };

  // --- Add entry (for both modes)
  const addEntry = async (entry) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');
      await fetch(`${BASE_API}/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      setLoggedFoods(prev => [...prev, entry]);
      setConsumed(prev => prev + entry.calories);
      cancelEntry();
    } catch (err) {
      console.error(err);
      if (searchMode) setSearchError('Could not add to log');
      if (calcMode) setCalcError('Could not add to log');
    }
  };

  if (bfpLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db344" />
      </View>
    );
  }

  // Chart: use CaloriePieChart component

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>FOOD LOG</Text>
        <Text style={styles.subHeader}>Goal: {goalCalories} kcal</Text>
        <CaloriePieChart consumed={consumedCalories} goal={goalCalories} />

        {loggedFoods.length > 0 && (
          <View style={styles.logList}>
            {loggedFoods.map((f, i) => (
              <Text key={i} style={styles.logItem}>
                • {f.description}: {f.calories} kcal
              </Text>
            ))}
          </View>
        )}

        {/* Modes */}
        {!searchMode && !calcMode && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.card} onPress={startSearch}>
              <Ionicons name="pencil-outline" size={36} color="#1db344" />
              <Text style={styles.cardText}>Enter Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={startCalc}>
              <Ionicons name="calculator-outline" size={36} color="#1db344" />
              <Text style={styles.cardText}>Calculator</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Mode UI */}
        {searchMode && (
          <View style={styles.manualContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1 banana"
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              multiline
            />
            {searchError ? <Text style={styles.error}>{searchError}</Text> : null}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={submitSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get Calories</Text>
              )}
            </TouchableOpacity>
            {searchEntry && !loading && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addEntry(searchEntry)}
              >
                <Text style={styles.addButtonText}>Add to Log</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.cancelLink} onPress={cancelEntry} disabled={loading}>
              <Text style={styles.cancelText}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Calculator Mode UI */}
        {calcMode && (
          <View style={styles.manualContainer}>
            <TextInput
              style={styles.input}
              placeholder="Calories per 100g"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={calsPer100}
              onChangeText={setCalsPer100}
            />
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Grams"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={grams}
              onChangeText={setGrams}
            />
            {calcError ? <Text style={styles.error}>{calcError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={calculateEntry}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            {calcEntry && (
              <>
                <Text style={styles.resultText}>
                  {calcEntry.description}: {calcEntry.calories} kcal
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addEntry(calcEntry)}
                >
                  <Text style={styles.addButtonText}>Add to Log</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.cancelLink} onPress={cancelEntry}>
              <Text style={styles.cancelText}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav Bar */}
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
  loadingContainer: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#111' },
  scrollContainer: { paddingTop: 60, paddingBottom: 80, alignItems: 'center' },
  header: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subHeader: { color: '#fff', fontSize: 16, marginVertical: 8 },
  logList: { width: CHART_WIDTH, marginTop: 16 },
  logItem: { color: '#fff', fontSize: 14, marginBottom: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', width: CHART_WIDTH, marginTop: 32 },
  manualContainer: { marginTop: 24, width: CHART_WIDTH, alignItems: 'center' },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    textAlignVertical: 'top',
  },
  button: { marginTop: 16, width: '100%', backgroundColor: '#1db344', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  addButton: { marginTop: 12, width: '100%', backgroundColor: '#36A2EB', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  cancelLink: { marginTop: 12 },
  cancelText: { color: '#888', fontSize: 16 },
  card: { width: CARD_SIZE, height: CARD_SIZE, backgroundColor: '#222', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  cardText: { color: '#fff', fontSize: 16, marginTop: 8, fontWeight: '500', textAlign: 'center' },
  resultText: { color: '#fff', fontSize: 16, marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '500' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '500' },
  error: { color: '#f33', marginTop: 8, textAlign: 'center' },
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
