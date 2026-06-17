import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function QuickActionButton({ emoji, label, onPress, color = COLORS.forestGreen }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.btn}>
      <Text style={[styles.emoji, { backgroundColor: color + '15' }]}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  emoji: {
    fontSize: 26,
    width: 56,
    height: 56,
    textAlign: 'center',
    lineHeight: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
