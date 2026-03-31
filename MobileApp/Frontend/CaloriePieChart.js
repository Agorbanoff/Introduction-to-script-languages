import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export default function CaloriePieChart({
  consumed = 0,
  goal = 2000,
  size = 228,
  animationDuration = 900,
}) {
  const clampedGoal = Math.max(0, goal);
  const animatedValue = useRef(new Animated.Value(consumed)).current;
  const haloScale = useRef(new Animated.Value(0.92)).current;
  const [animatedConsumed, setAnimatedConsumed] = useState(consumed);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: consumed,
        duration: Math.max(180, animationDuration),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(haloScale, {
          toValue: 1.04,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(haloScale, {
          toValue: 1,
          damping: 12,
          stiffness: 120,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [animationDuration, animatedValue, consumed, haloScale]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setAnimatedConsumed(value);
    });

    return () => animatedValue.removeListener(listener);
  }, [animatedValue]);

  const safeConsumed = Math.max(0, animatedConsumed);
  const ratio = clampedGoal > 0 ? safeConsumed / clampedGoal : 0;
  const clampedRatio = Math.max(0, Math.min(ratio, 1));
  const displayConsumed = Math.round(safeConsumed);
  const displayRemaining = Math.max(Math.round(clampedGoal - safeConsumed), 0);
  const displayPercent = clampedGoal > 0 ? Math.round(ratio * 100) : 0;
  const isOverGoal = ratio > 1;

  const radius = size * 0.34;
  const strokeWidth = size * 0.078;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedRatio);
  const center = size / 2;

  const angle = clampedRatio * Math.PI * 2 - Math.PI / 2;
  const dotX = center + radius * Math.cos(angle);
  const dotY = center + radius * Math.sin(angle);

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.eyebrow}>Daily energy</Text>
          <Text style={styles.title}>Calorie balance</Text>
        </View>
        <View style={[styles.statusBadge, isOverGoal && styles.statusBadgeWarm]}>
          <Text style={[styles.statusText, isOverGoal && styles.statusTextWarm]}>
            {isOverGoal ? 'Over goal' : 'On track'}
          </Text>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Animated.View
          style={[
            styles.halo,
            isOverGoal ? styles.haloWarm : styles.haloCool,
            { transform: [{ scale: haloScale }] },
          ]}
        />

        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient
              id="progressCool"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#7af6e0" />
              <Stop offset="100%" stopColor="#3ecf8e" />
            </LinearGradient>
            <LinearGradient
              id="progressWarm"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#ff8d6c" />
              <Stop offset="100%" stopColor="#ff5f73" />
            </LinearGradient>
          </Defs>

          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={isOverGoal ? 'url(#progressWarm)' : 'url(#progressCool)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
            />
          </G>

          <Circle
            cx={center}
            cy={center}
            r={radius * 0.76}
            fill="rgba(9, 16, 23, 0.96)"
          />

          <Circle
            cx={dotX}
            cy={dotY}
            r={strokeWidth * 0.42}
            fill={isOverGoal ? '#ff7c79' : '#85ffe1'}
          />
        </Svg>

        <View style={styles.centerCopy}>
          <Text style={styles.centerValue}>{displayConsumed}</Text>
          <Text style={styles.centerUnit}>kcal consumed</Text>
          <Text style={styles.centerSubtext}>
            {displayRemaining} kcal remaining
          </Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Goal</Text>
          <Text style={styles.metricValue}>{clampedGoal}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Progress</Text>
          <Text style={styles.metricValue}>{displayPercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  headingRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  eyebrow: {
    color: 'rgba(214, 244, 236, 0.62)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  title: {
    color: '#f8fffc',
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(111, 247, 199, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(111, 247, 199, 0.24)',
  },
  statusBadgeWarm: {
    backgroundColor: 'rgba(255, 117, 105, 0.12)',
    borderColor: 'rgba(255, 117, 105, 0.22)',
  },
  statusText: {
    color: '#b7ffe7',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextWarm: {
    color: '#ffd2c8',
  },
  chartWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  halo: {
    position: 'absolute',
    width: '62%',
    aspectRatio: 1,
    borderRadius: 999,
    opacity: 0.28,
  },
  haloCool: {
    backgroundColor: '#4effc9',
  },
  haloWarm: {
    backgroundColor: '#ff7e73',
  },
  centerCopy: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    color: '#f8fffc',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  centerUnit: {
    color: '#d7e7e2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  centerSubtext: {
    color: 'rgba(201, 214, 210, 0.72)',
    fontSize: 13,
    marginTop: 6,
  },
  metricRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  metricLabel: {
    color: 'rgba(208, 223, 218, 0.66)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  metricValue: {
    color: '#f9fffd',
    fontSize: 24,
    fontWeight: '700',
  },
});
