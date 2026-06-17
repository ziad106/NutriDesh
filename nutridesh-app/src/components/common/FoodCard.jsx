import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const MEAL_ICONS = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍵',
  sehri: '🌙',
  iftar: '🌇',
};

export default function FoodCard({ meal, onPress, onDelete }) {
  if (!meal) return null;
  const food = meal.food;
  const factor = (meal.portion_g || 100) / 100;
  const cals = food ? Math.round(food.calories * factor) : 0;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <Text style={styles.emoji}>{food?.emoji || MEAL_ICONS[meal.mealType] || '🍽️'}</Text>
      <View style={styles.middle}>
        <Text style={styles.title}>{meal.foodName || food?.name_bn}</Text>
        <Text style={styles.sub}>
          {toBanglaNumber(meal.portion_g || 100)}গ্রাম · {toBanglaNumber(cals)} kcal
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.mealIcon}>{MEAL_ICONS[meal.mealType] || ''}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSurface,
    padding: 14,
    marginVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
  middle: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  sub: { fontSize: 13, color: COLORS.textSecondary },
  right: { marginLeft: 8 },
  mealIcon: { fontSize: 20 },
});
