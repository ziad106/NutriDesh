import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';

export default function SplashScreen({ navigation }) {
  const isOnboarded = useSelector((s) => s.auth.isOnboarded);
  const logoOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));
    taglineY.value = withDelay(500, withTiming(0, { duration: 700 }));

    const t = setTimeout(() => {
      navigation.replace(isOnboarded ? 'Main' : 'LanguageSelect');
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const tagStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View style={styles.box}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.leaf}>🌿</Text>
        <Text style={styles.logo}>{STRINGS.APP_NAME}</Text>
        <Text style={styles.brand}>NutriDesh</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, tagStyle]}>{STRINGS.TAGLINE}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: COLORS.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center' },
  leaf: { fontSize: 64, marginBottom: 8 },
  logo: { fontSize: 36, fontWeight: '700', color: COLORS.forestGreen, marginBottom: 4 },
  brand: { fontSize: 18, color: COLORS.textSecondary, letterSpacing: 2 },
  tagline: { marginTop: 32, fontSize: 16, color: COLORS.textSecondary },
});
