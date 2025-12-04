import React, { useEffect, useRef, useState } from 'react';
import { View, Text as RNText, StyleSheet, Animated } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';

// Animated donut chart using only React Native and react-native-svg (no new packages)
export default function CaloriePieChart({ consumed = 0, goal = 2000, size = 220, animationDuration = 600 }) {
  const clampedGoal = Math.max(0, goal);

  // Animated value (drives slice and number animation)
  const animated = useRef(new Animated.Value(consumed)).current;
  const [animatedConsumed, setAnimatedConsumed] = useState(consumed);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // animate numeric value
    Animated.timing(animated, {
      toValue: consumed,
      duration: Math.max(80, animationDuration),
      useNativeDriver: false,
    }).start();

    // pulse the pill
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.06, duration: 140, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [consumed, animationDuration, animated, scaleAnim]);

  // listen to animated value and reflect into state for path math
  useEffect(() => {
    const id = animated.addListener(({ value }) => setAnimatedConsumed(value));
    return () => animated.removeListener(id);
  }, [animated]);

  // use animated value for visuals
  const consumedValue = Math.max(0, animatedConsumed);
  const remainingValue = Math.max(clampedGoal - consumedValue, 0);
  const total = consumedValue + remainingValue || 1; // avoid division by zero
  const percent = clampedGoal > 0 ? Math.round((consumedValue / clampedGoal) * 100) : 0;

  // dynamic color depending on how close to/over the goal
  const consumedColor = (() => {
    if (clampedGoal <= 0) return '#4CAF50';
    const ratio = consumedValue / clampedGoal;
    if (ratio >= 1) return '#e53935';
    if (ratio >= 0.9) return '#FB8C00';
    return '#4CAF50';
  })();

  // SVG geometry
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.62;

  const toRadians = deg => (deg * Math.PI) / 180;
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = toRadians(angleInDegrees - 90);
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeDonutSlice = (cx, cy, outerR, innerR, startAngle, endAngle) => {
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

    return `M ${outerStart.x} ${outerStart.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerStart.x} ${innerStart.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`;
  };

  // compute angles with a small gap between slices for separation
  const startAngle = 0;
  const consumedAngle = (consumedValue / total) * 360;
  const gap = 1.8; // degrees
  const consumedStart = startAngle + gap / 2;
  const consumedEnd = consumedStart + Math.max(consumedAngle - gap, 0);
  const remainingStart = consumedEnd + gap / 2;
  const remainingEnd = 360 - gap / 2;

  const consumedPath = describeDonutSlice(cx, cy, outerR, innerR, consumedStart, consumedEnd);
  const remainingPath = describeDonutSlice(cx, cy, outerR, innerR, remainingStart, remainingEnd);

  // friendly display values
  const displayConsumed = Math.round(consumedValue);
  const displayRemaining = Math.round(Math.max(clampedGoal - consumedValue, 0));

  return (
    <View style={styles.container}>
      <RNText style={styles.title}>Daily Calories</RNText>

      <Svg width={size} height={size}>
        <G>
          {/* subtle inner circle */}
          <Circle cx={cx} cy={cy} r={innerR} fill="#000" opacity={0.12} />

          {/* draw remaining first */}
          <Path d={remainingPath} fill="#222224" stroke="#111" strokeWidth={1} />
          <Path d={consumedPath} fill={consumedColor} stroke="#111" strokeWidth={1} />

          {/* percentage in center */}
          <SvgText x={cx} y={cy - 8} fill="#fff" fontSize="28" fontWeight="700" textAnchor="middle">
            {percent}%
          </SvgText>
        </G>
      </Svg>

      {/* prominent calorie pill below chart for readability (white pill, colored number) */}
      <Animated.View style={[styles.pill, { transform: [{ scale: scaleAnim }] }]}>
        <RNText style={[styles.pillNumber, { color: consumedColor }]}>{displayConsumed}</RNText>
        <RNText style={[styles.pillLabel, { color: '#666' }]}>kcal</RNText>
      </Animated.View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: consumedColor }]} />
          <RNText style={styles.legendText}>Consumed ({displayConsumed} kcal)</RNText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#222224' }]} />
          <RNText style={styles.legendText}>Remaining ({displayRemaining} kcal)</RNText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  pill: {
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'baseline',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  pillNumber: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: '800',
    marginRight: 8,
  },
  pillLabel: {
    color: '#666',
    fontSize: 12,
    opacity: 0.95,
  },
  legendRow: {
    marginTop: 12,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    color: '#ddd',
    fontSize: 13,
  },
});