import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function GITrafficLight({ giCategory = 'low' }) {
  const cfg = {
    low: { color: COLORS.safeGreen, label: 'নিরাপদ (কম GI)', emoji: '🟢' },
    medium: { color: COLORS.moderateOrange, label: 'সতর্ক (মাঝারি GI)', emoji: '🟡' },
    high: { color: COLORS.alertRed, label: 'এড়ান (উচ্চ GI)', emoji: '🔴' },
  }[giCategory] || { color: COLORS.textDisabled, label: 'N/A', emoji: '⚪' };

  return (
    <View style={[styles.badge, { backgroundColor: cfg.color + '20', borderColor: cfg.color }]}>
      <Text style={styles.emoji}>{cfg.emoji}</Text>
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  emoji: { fontSize: 14, marginRight: 6 },
  label: { fontSize: 13, fontWeight: '600' },
});
