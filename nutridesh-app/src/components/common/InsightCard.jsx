import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';

export default function InsightCard({ title = STRINGS.TODAY_INSIGHT, message, icon = '🌿' }) {
  return (
    <View style={styles.card}>
      <View style={styles.leftAccent} />
      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardSurface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  leftAccent: {
    width: 5,
    backgroundColor: COLORS.forestGreen,
  },
  body: {
    flex: 1,
    padding: 14,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.forestGreen },
  message: { fontSize: 15, lineHeight: 22, color: COLORS.textPrimary },
});
