import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function NutritionRing({
  size = 180,
  strokeWidth = 14,
  progress = 0.6,
  caloriesRemaining = 700,
  caloriesTotal = 1800,
  caloriesConsumed = 1100,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.forestGreen}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={styles.bigNum}>{toBanglaNumber(Math.max(0, Math.round(caloriesRemaining)))}</Text>
        <Text style={styles.label}>kcal বাকি</Text>
        <Text style={styles.sub}>
          {toBanglaNumber(Math.round(caloriesConsumed))} / {toBanglaNumber(caloriesTotal)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  bigNum: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.clayOrange,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sub: {
    fontSize: 12,
    color: COLORS.textDisabled,
    marginTop: 4,
  },
});
