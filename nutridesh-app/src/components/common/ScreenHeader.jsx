import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ScreenHeader({ title, onBack, right }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.btn} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.btn} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.btn}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.warmCream,
  },
  btn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 28, color: COLORS.textPrimary },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
});
