import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';

// Lightweight animated cooking pot — Reanimated, no Lottie file needed
export default function LottieLoader({ label = 'বিশ্লেষণ করা হচ্ছে...' }) {
  const steam = useSharedValue(0);
  useEffect(() => {
    steam.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const steam1Style = useAnimatedStyle(() => ({
    opacity: 1 - steam.value,
    transform: [{ translateY: -30 * steam.value }],
  }));
  const steam2Style = useAnimatedStyle(() => ({
    opacity: 1 - steam.value,
    transform: [{ translateY: -40 * steam.value }, { translateX: 8 }],
  }));
  return (
    <View style={styles.box}>
      <View style={styles.steamWrap}>
        <Animated.Text style={[styles.steam, steam1Style]}>~</Animated.Text>
        <Animated.Text style={[styles.steam, steam2Style]}>~</Animated.Text>
      </View>
      <Text style={styles.pot}>🍲</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', padding: 16 },
  steamWrap: { flexDirection: 'row', height: 28, alignItems: 'flex-end' },
  steam: { fontSize: 28, color: COLORS.textDisabled, marginHorizontal: 2 },
  pot: { fontSize: 64 },
  label: { marginTop: 12, fontSize: 16, color: COLORS.textPrimary },
});
