import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function DeficiencyAlert({ message, onPress }) {
  if (!message) return null;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.msg}>{message}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4E4',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.alertRed,
  },
  icon: { fontSize: 22, marginRight: 10 },
  msg: { flex: 1, fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
});
