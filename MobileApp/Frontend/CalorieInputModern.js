import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API } from './apiConfig';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CaloriePieChart from './CaloriePieChart';
import { ensureAccessToken } from './authManager';
import AnimatedScreenView from './AnimatedScreenView';
import FloatingNavBar from './FloatingNavBar';
import { authFetch } from './authFetch';
import { getApiErrorMessage, parseApiResponse } from './apiResponse';
import { getFallbackFoodResult } from './foodLookup';

const { width } = Dimensions.get('window');
const CONTENT_WIDTH = width - 32;
const CALORIE_LOG_STORAGE_KEY = 'calorie_log_entries';

export default function CalorieInputModern() {
  const navigation = useNavigation();

  const [goalCalories, setGoalCalories] = useState(2000);
  const [loggedFoods, setLoggedFoods] = useState([]);

  const [searchMode, setSearchMode] = useState(false);
  const [calcMode, setCalcMode] = useState(false);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchEntry, setSearchEntry] = useState(null);

  const [calsPer100, setCalsPer100] = useState('');
  const [grams, setGrams] = useState('');
  const [calcError, setCalcError] = useState('');
  const [calcEntry, setCalcEntry] = useState(null);

  const [bfpLoading, setBfpLoading] = useState(true);

  useEffect(() => {
    const loadLoggedFoods = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(CALORIE_LOG_STORAGE_KEY);
        if (!storedEntries) {
          return;
        }

        const parsedEntries = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries)) {
          setLoggedFoods(parsedEntries);
        }
      } catch (error) {
        console.error('Could not load calorie log entries:', error);
      }
    };

    loadLoggedFoods();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await ensureAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }

        const res = await authFetch(`${BASE_API}/stats/statistics`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await parseApiResponse(res);
        const BFP = data?.BFP;
        setGoalCalories(BFP > 25 ? 2000 : 2500);
      } catch (err) {
        console.error(err);
        setGoalCalories(2000);
      } finally {
        setBfpLoading(false);
      }
    })();
  }, []);

  const consumedCalories = useMemo(
    () =>
      loggedFoods.reduce(
        (total, entry) => total + (Number(entry?.calories) || 0),
        0
      ),
    [loggedFoods]
  );

  const remainingCalories = useMemo(
    () => Math.max(goalCalories - consumedCalories, 0),
    [consumedCalories, goalCalories]
  );

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

  const cancelEntry = () => {
    setSearchMode(false);
    setCalcMode(false);
    setSearchError('');
    setCalcError('');
    setSearchMessage('');
  };

  const buildSearchEntry = (message, description) => {
    const match = message.match(/Calories:\s*([0-9]+)/i);

    if (!match) {
      return null;
    }

    return {
      description,
      calories: parseInt(match[1], 10),
    };
  };

  const submitSearch = async () => {
    if (!query.trim()) {
      setSearchError('Please type a food description first.');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSearchMessage('');
    setSearchEntry(null);

    try {
      const res = await fetch(
        `${BASE_API}/food/search?query=${encodeURIComponent(query)}`
      );
      const data = await parseApiResponse(res);

      if (res.ok) {
        const message = data?.message || '';
        const entry = buildSearchEntry(message, query.trim());

        if (entry) {
          setSearchMessage(message);
          setSearchEntry(entry);
          return;
        }
      }

      const fallbackResult = getFallbackFoodResult(query);
      if (fallbackResult) {
        setSearchMessage(fallbackResult.message);
        setSearchEntry({
          description: query.trim(),
          calories: fallbackResult.calories,
        });
        return;
      }

      throw new Error(getApiErrorMessage(data, 'Item not found'));
    } catch (err) {
      setSearchError(err.message || 'Item not found');
    } finally {
      setLoading(false);
    }
  };

  const calculateEntry = () => {
    setCalcError('');

    const per100 = parseFloat(calsPer100);
    const gramsValue = parseFloat(grams);

    if (isNaN(per100) || per100 <= 0) {
      setCalcError('Enter a valid calories-per-100g value.');
      return;
    }

    if (isNaN(gramsValue) || gramsValue <= 0) {
      setCalcError('Enter a valid weight in grams.');
      return;
    }

    const total = Math.round((per100 * gramsValue) / 100);
    setCalcEntry({
      description: `${gramsValue}g at ${per100} kcal/100g`,
      calories: total,
    });
  };

  const addEntry = async (entry) => {
    try {
      const nextEntries = [entry, ...loggedFoods];
      setLoggedFoods(nextEntries);
      await AsyncStorage.setItem(
        CALORIE_LOG_STORAGE_KEY,
        JSON.stringify(nextEntries)
      );
      cancelEntry();
    } catch (err) {
      console.error(err);
      if (searchMode) {
        setSearchError('Could not add this item to your log.');
      }
      if (calcMode) {
        setCalcError('Could not add this item to your log.');
      }
    }
  };

  if (bfpLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6ff7c7" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <SafeAreaView style={styles.safeArea}>
        <AnimatedScreenView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.heroCard}>
              <Text style={styles.kicker}>Nutrition dashboard</Text>
              <Text style={styles.header}>Track daily fuel in a cleaner way.</Text>
              <Text style={styles.subHeader}>
                Log meals, calculate portions, and keep the lower screen visible
                with a floating navigation bar.
              </Text>
            </View>

            <View style={styles.chartCard}>
              <CaloriePieChart
                consumed={consumedCalories}
                goal={goalCalories}
                size={Math.min(width - 72, 260)}
              />
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.summaryCardAccent]}>
                <Text style={styles.summaryLabel}>Remaining</Text>
                <Text style={styles.summaryValue}>{remainingCalories}</Text>
                <Text style={styles.summaryUnit}>kcal left today</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Logged meals</Text>
                <Text style={styles.summaryValue}>{loggedFoods.length}</Text>
                <Text style={styles.summaryUnit}>entries saved</Text>
              </View>
            </View>

            <View style={styles.logCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Recent entries</Text>
                <Text style={styles.sectionCaption}>Goal {goalCalories} kcal</Text>
              </View>

              {loggedFoods.length > 0 ? (
                loggedFoods.map((food, index) => (
                  <View
                    key={`${food.description}-${index}`}
                    style={[
                      styles.logItem,
                      index === loggedFoods.length - 1 && styles.logItemLast,
                    ]}
                  >
                    <View style={styles.logIcon}>
                      <Ionicons
                        name="leaf-outline"
                        size={16}
                        color="#9dffe0"
                      />
                    </View>
                    <View style={styles.logCopy}>
                      <Text style={styles.logTitle}>{food.description}</Text>
                      <Text style={styles.logCalories}>{food.calories} kcal</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyStateText}>
                  Your log is still empty. Add your first food entry to bring
                  this dashboard to life.
                </Text>
              )}
            </View>

            {!searchMode && !calcMode && (
              <AnimatedScreenView delay={90}>
                <View style={styles.actionPanel}>
                  <Text style={styles.sectionTitle}>Add a new entry</Text>
                  <Text style={styles.sectionCaptionWide}>
                    Pick the flow that fits how you want to log your food.
                  </Text>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[styles.modeCard, styles.modeCardPrimary]}
                      onPress={startSearch}
                    >
                      <Ionicons
                        name="create-outline"
                        size={28}
                        color="#071611"
                      />
                      <Text style={[styles.modeTitle, styles.modeTitlePrimary]}>
                        Search calories
                      </Text>
                      <Text style={[styles.modeText, styles.modeTextPrimary]}>
                        Type a food and extract calories quickly.
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.modeCard}
                      onPress={startCalc}
                    >
                      <Ionicons
                        name="calculator-outline"
                        size={28}
                        color="#9dffe0"
                      />
                      <Text style={styles.modeTitle}>Portion calculator</Text>
                      <Text style={styles.modeText}>
                        Compute calories from grams and a label value.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedScreenView>
            )}

            {searchMode && (
              <AnimatedScreenView delay={60}>
                <View style={styles.editorCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Search calories</Text>
                    <TouchableOpacity onPress={cancelEntry}>
                      <Text style={styles.dismissText}>Close</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Example: grilled chicken wrap"
                    placeholderTextColor="#6d7f7d"
                    value={query}
                    onChangeText={setQuery}
                    multiline
                  />

                  {searchError ? (
                    <Text style={styles.error}>{searchError}</Text>
                  ) : null}

                  {searchMessage ? (
                    <Text style={styles.helperText}>{searchMessage}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={submitSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#04130d" />
                    ) : (
                      <Text style={styles.buttonText}>Check calories</Text>
                    )}
                  </TouchableOpacity>

                  {searchEntry && !loading && (
                    <View style={styles.previewCard}>
                      <Text style={styles.previewTitle}>{searchEntry.description}</Text>
                      <Text style={styles.previewValue}>
                        {searchEntry.calories} kcal
                      </Text>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => addEntry(searchEntry)}
                      >
                        <Text style={styles.secondaryButtonText}>
                          Add to food log
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </AnimatedScreenView>
            )}

            {calcMode && (
              <AnimatedScreenView delay={60}>
                <View style={styles.editorCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Portion calculator</Text>
                    <TouchableOpacity onPress={cancelEntry}>
                      <Text style={styles.dismissText}>Close</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Calories per 100g"
                    placeholderTextColor="#6d7f7d"
                    keyboardType="numeric"
                    value={calsPer100}
                    onChangeText={setCalsPer100}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Weight in grams"
                    placeholderTextColor="#6d7f7d"
                    keyboardType="numeric"
                    value={grams}
                    onChangeText={setGrams}
                  />

                  {calcError ? <Text style={styles.error}>{calcError}</Text> : null}

                  <TouchableOpacity style={styles.button} onPress={calculateEntry}>
                    <Text style={styles.buttonText}>Calculate calories</Text>
                  </TouchableOpacity>

                  {calcEntry && (
                    <View style={styles.previewCard}>
                      <Text style={styles.previewTitle}>{calcEntry.description}</Text>
                      <Text style={styles.previewValue}>
                        {calcEntry.calories} kcal
                      </Text>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => addEntry(calcEntry)}
                      >
                        <Text style={styles.secondaryButtonText}>
                          Add to food log
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </AnimatedScreenView>
            )}
          </ScrollView>

          <FloatingNavBar navigation={navigation} activeRoute="calorieinput" />
        </AnimatedScreenView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#05080d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: '#05080d',
  },
  safeArea: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.22,
  },
  glowTop: {
    width: 260,
    height: 260,
    top: -40,
    right: -80,
    backgroundColor: '#40d8a1',
  },
  glowBottom: {
    width: 220,
    height: 220,
    bottom: 110,
    left: -80,
    backgroundColor: '#ff715f',
  },
  scrollContainer: {
    paddingTop: 18,
    paddingBottom: 140,
    paddingHorizontal: 16,
  },
  heroCard: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  kicker: {
    color: '#9dffe0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  header: {
    color: '#f7fffb',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  subHeader: {
    color: 'rgba(214, 229, 224, 0.72)',
    fontSize: 15,
    lineHeight: 22,
  },
  chartCard: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    borderRadius: 34,
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: 'rgba(8, 14, 20, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
  },
  summaryRow: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: (CONTENT_WIDTH - 8) / 2,
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryCardAccent: {
    backgroundColor: 'rgba(111, 247, 199, 0.1)',
    borderColor: 'rgba(111, 247, 199, 0.18)',
  },
  summaryLabel: {
    color: 'rgba(215, 228, 223, 0.65)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  summaryValue: {
    color: '#f8fffd',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryUnit: {
    color: 'rgba(208, 221, 217, 0.74)',
    fontSize: 13,
  },
  logCard: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#f7fffb',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCaption: {
    color: 'rgba(191, 207, 202, 0.62)',
    fontSize: 12,
  },
  sectionCaptionWide: {
    color: 'rgba(191, 207, 202, 0.68)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  logItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  logIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(111, 247, 199, 0.11)',
    marginRight: 12,
  },
  logCopy: {
    flex: 1,
  },
  logTitle: {
    color: '#f6fffb',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  logCalories: {
    color: 'rgba(198, 213, 209, 0.68)',
    fontSize: 13,
  },
  emptyStateText: {
    color: 'rgba(195, 208, 205, 0.7)',
    fontSize: 14,
    lineHeight: 22,
  },
  actionPanel: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'rgba(8, 14, 20, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: (CONTENT_WIDTH - 56) / 2,
    minHeight: 170,
    borderRadius: 24,
    padding: 18,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  modeCardPrimary: {
    backgroundColor: '#6ff7c7',
    borderColor: '#6ff7c7',
  },
  modeTitle: {
    color: '#f7fffb',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },
  modeTitlePrimary: {
    color: '#071611',
  },
  modeText: {
    color: 'rgba(225, 239, 235, 0.76)',
    fontSize: 13,
    lineHeight: 19,
  },
  modeTextPrimary: {
    color: 'rgba(7, 22, 17, 0.72)',
  },
  editorCard: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'rgba(8, 14, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
  },
  dismissText: {
    color: '#9dffe0',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    color: '#f8fffd',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    color: 'rgba(213, 226, 222, 0.78)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  error: {
    color: '#ff8f88',
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6ff7c7',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#071611',
    fontSize: 16,
    fontWeight: '800',
  },
  previewCard: {
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  previewTitle: {
    color: '#f8fffd',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewValue: {
    color: '#9dffe0',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 14,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(111, 247, 199, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(111, 247, 199, 0.22)',
  },
  secondaryButtonText: {
    color: '#dffff4',
    fontSize: 15,
    fontWeight: '700',
  },
});
