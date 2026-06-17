import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

export default function MacroPill({ label, value = 0, target = 0, color = COLORS.forestGreen }) {
  const pct = target ? Math.min(100, (value / target) * 100) : 0;
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.value}>
        {toBanglaNumber(Math.round(value))}g / {toBanglaNumber(Math.round(target))}g
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  value: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600' },
});
