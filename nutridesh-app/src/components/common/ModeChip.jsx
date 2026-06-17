import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

const MODE_CONFIG = {
  diabetes: { icon: '🟡', label: 'ডায়াবেটিস মোড', color: COLORS.turmericYellow },
  pregnancy: { icon: '🩵', label: 'গর্ভাবস্থা মোড', color: COLORS.softTeal },
  child: { icon: '🔵', label: 'শিশু মোড', color: COLORS.playfulBlue },
  ramadan: { icon: '🌙', label: 'রমজান মোড', color: COLORS.clayOrange },
  hypertension: { icon: '❤️', label: 'রক্তচাপ মোড', color: COLORS.alertRed },
  anaemia: { icon: '💧', label: 'রক্তশূন্যতা মোড', color: COLORS.terracotta },
};

export default function ModeChip({ mode, onPress }) {
  const cfg = MODE_CONFIG[mode];
  if (!cfg) return null;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, { backgroundColor: cfg.color + '22', borderColor: cfg.color }]}
    >
      <Text style={styles.icon}>{cfg.icon}</Text>
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  icon: { fontSize: 14, marginRight: 4 },
  label: { fontSize: 13, fontWeight: '600' },
});
