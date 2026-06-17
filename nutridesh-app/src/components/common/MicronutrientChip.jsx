import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

export default function MicronutrientChip({ icon = '🌿', label, percent = 0 }) {
  const isLow = percent < 40;
  const isMed = percent >= 40 && percent < 70;
  const bg = isLow
    ? '#FCE4E4'
    : isMed
    ? '#FFF4E0'
    : '#E8F5E9';
  const fg = isLow
    ? COLORS.alertRed
    : isMed
    ? COLORS.clayOrange
    : COLORS.forestGreen;
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
        <Text style={[styles.pct, { color: fg }]}>{toBanglaNumber(percent)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 10,
    minWidth: 110,
  },
  icon: { fontSize: 22, marginRight: 8 },
  label: { fontSize: 12, fontWeight: '600' },
  pct: { fontSize: 16, fontWeight: '700' },
});
