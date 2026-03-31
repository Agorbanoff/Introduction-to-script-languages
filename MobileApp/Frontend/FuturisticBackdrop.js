import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const defaultSource = require('./Images/gymPhoto.jpg');

export default function FuturisticBackdrop({
  children,
  source = defaultSource,
  overlayStyle,
  contentStyle,
}) {
  return (
    <ImageBackground source={source} style={styles.background} resizeMode="cover">
      <View style={[styles.overlay, overlayStyle]}>
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowSide]} />
        <View style={[styles.glow, styles.glowBottom]} />
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 18, 0.82)',
  },
  content: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  glowTop: {
    width: 260,
    height: 260,
    top: -40,
    right: -70,
    backgroundColor: '#44ddb0',
  },
  glowSide: {
    width: 180,
    height: 180,
    top: '36%',
    left: -70,
    backgroundColor: '#5d8cff',
    opacity: 0.16,
  },
  glowBottom: {
    width: 240,
    height: 240,
    bottom: -80,
    right: -40,
    backgroundColor: '#ff7867',
  },
});
