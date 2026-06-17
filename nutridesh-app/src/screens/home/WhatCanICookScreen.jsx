import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import LottieLoader from '../../components/common/LottieLoader';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';
import { whatCanICook } from '../../services/api';

const INGREDIENTS = [
  { id: 'rice', label: 'চাল', emoji: '🍚' },
  { id: 'dal', label: 'ডাল', emoji: '🥣' },
  { id: 'fish', label: 'মাছ', emoji: '🐟' },
  { id: 'egg', label: 'ডিম', emoji: '🥚' },
  { id: 'shak', label: 'শাক', emoji: '🥬' },
  { id: 'potato', label: 'আলু', emoji: '🥔' },
  { id: 'onion', label: 'পেঁয়াজ', emoji: '🧅' },
  { id: 'tomato', label: 'টমেটো', emoji: '🍅' },
  { id: 'chicken', label: 'মুরগি', emoji: '🍗' },
  { id: 'oil', label: 'তেল', emoji: '🫒' },
];

export default function WhatCanICookScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);

  function toggle(id) {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  async function go() {
    setLoading(true);
    const res = await whatCanICook(selected);
    setRecipes(res.recipes);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="কী রান্না করব?" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.q}>আপনার কাছে যা আছে নির্বাচন করুন:</Text>
        <View style={styles.grid}>
          {INGREDIENTS.map((i) => {
            const active = selected.includes(i.id);
            return (
              <TouchableOpacity
                key={i.id}
                style={[styles.ingr, active && styles.ingrActive]}
                onPress={() => toggle(i.id)}
              >
                <Text style={styles.ingrEmoji}>{i.emoji}</Text>
                <Text style={[styles.ingrLabel, active && { color: '#fff' }]}>{i.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.cta} onPress={go}>
          <Text style={styles.ctaText}>রেসিপি সাজেস্ট করুন</Text>
        </TouchableOpacity>

        {loading && <LottieLoader />}

        {recipes && !loading && recipes.map((r, i) => (
          <View key={i} style={styles.recipe}>
            <View style={styles.recipeHead}>
              <Text style={styles.recipeName}>{r.name_bn}</Text>
              <Text style={styles.recipeTime}>⏱ {toBanglaNumber(r.cooking_time_min)} মিনিট</Text>
            </View>
            <View style={styles.metrics}>
              <Text style={styles.metric}>স্বাস্থ্য স্কোর: {toBanglaNumber(r.nutrition_score)}/১০</Text>
              <Text style={styles.metric}>{toBanglaNumber(r.estimated_calories)} kcal</Text>
              {r.is_diabetic_safe && <Text style={[styles.metric, styles.safeBadge]}>✅ ডায়াবেটিক</Text>}
            </View>
            <Text style={styles.instr}>{r.instructions_bn}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  q: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  ingr: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 12,
    margin: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  ingrActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  ingrEmoji: { fontSize: 28, marginBottom: 4 },
  ingrLabel: { fontSize: 12, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  recipe: { backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 14, marginTop: 14 },
  recipeHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  recipeName: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  recipeTime: { fontSize: 13, color: COLORS.textSecondary },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  metric: { fontSize: 12, marginRight: 8, marginBottom: 4, backgroundColor: COLORS.warmCream, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, color: COLORS.textPrimary },
  safeBadge: { backgroundColor: '#E8F5E9', color: COLORS.forestGreen },
  instr: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
});
