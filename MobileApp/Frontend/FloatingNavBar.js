import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NAV_ITEMS = [
  { route: 'gym', label: 'Train', icon: 'barbell-outline', reset: true },
  { route: 'diet', label: 'Meals', icon: 'restaurant-outline', reset: true },
  { route: 'calorieinput', label: 'Log', icon: 'sparkles-outline', reset: false },
  { route: 'settings', label: 'Settings', icon: 'settings-outline', reset: true },
];

export default function FloatingNavBar({ navigation, activeRoute }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        mass: 0.9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const handlePress = (item) => {
    if (item.route === activeRoute) {
      return;
    }

    if (item.reset) {
      navigation.reset({ index: 0, routes: [{ name: item.route }] });
      return;
    }

    navigation.navigate(item.route);
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.shell,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.route === activeRoute;

        return (
          <TouchableOpacity
            key={item.route}
            activeOpacity={0.86}
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Ionicons
                name={item.icon}
                size={21}
                color={isActive ? '#071611' : '#dcfff2'}
              />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(7, 11, 18, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 18,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 4,
  },
  iconWrapActive: {
    backgroundColor: '#6ff7c7',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(225, 236, 233, 0.72)',
  },
  labelActive: {
    color: '#f4fffa',
  },
});
