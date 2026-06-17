import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import LottieLoader from '../../components/common/LottieLoader';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';
import { getRecommendations } from '../../services/api';
import { FOODS_BD } from '../../data/foodsBD';

const BUDGETS = [50, 100, 150, 200, 300];

export default function BudgetMealScreen({ navigation }) {
  const profile = useSelector((s) => s.profile.profile);
  const [budget, setBudget] = useState('150');
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState(null);

  async function go(b) {
    setBudget(String(b));
    setLoading(true);
    const res = await getRecommendations(profile, {}, Number(b));
    setRecs(res.recommendations);
    setLoading(false);
  }

  const proteinPicks = FOODS_BD.filter((f) => f.protein >= 8).slice(0, 6);

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="বাজেট মিল" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.q}>আজকের বাজেট কত? (৳)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
        <View style={styles.chipsRow}>
          {BUDGETS.map((b) => (
            <TouchableOpacity key={b} style={styles.chip} onPress={() => go(b)}>
              <Text style={styles.chipText}>৳{toBanglaNumber(b)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={() => go(Number(budget))}>
          <Text style={styles.ctaText}>মিল সাজেশন পান</Text>
        </TouchableOpacity>

        {loading && <LottieLoader label="বাজেটের মধ্যে সেরা খাবার খুঁজছি..." />}

        {recs && !loading && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.section}>সাজেশন ({toBanglaNumber(budget)} টাকার মধ্যে)</Text>
            {recs.map((r, i) => (
              <View key={i} style={styles.recCard}>
                <Text style={styles.recEmoji}>{r.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recName}>{r.meal_name_bn}</Text>
                  <Text style={styles.recSub}>{r.reason_bn}</Text>
                  <Text style={styles.recPrice}>৳{toBanglaNumber(r.estimated_cost_bdt)} · {toBanglaNumber(r.estimated_calories)} kcal</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.section, { marginTop: 24 }]}>বাজার মূল্য (Dhaka)</Text>
        <View style={styles.priceCard}>
          <View style={[styles.priceRow, styles.priceHead]}>
            <Text style={styles.priceCol}>খাবার</Text>
            <Text style={styles.priceCol}>প্রোটিন</Text>
            <Text style={styles.priceCol}>দাম</Text>
          </View>
          {proteinPicks.map((f) => (
            <View key={f.id} style={styles.priceRow}>
              <Text style={[styles.priceCol, { flex: 2 }]}>{f.emoji} {f.name_bn}</Text>
              <Text style={styles.priceCol}>{toBanglaNumber(f.protein)}g</Text>
              <Text style={styles.priceCol}>৳{toBanglaNumber(f.price * 10)}/কেজি</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  q: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.cardSurface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.cardSurface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, marginBottom: 8 },
  chipText: { fontSize: 15, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  recCard: { flexDirection: 'row', backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 12, marginBottom: 10 },
  recEmoji: { fontSize: 32, marginRight: 12 },
  recName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  recSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  recPrice: { fontSize: 13, color: COLORS.forestGreen, marginTop: 4, fontWeight: '600' },
  priceCard: { backgroundColor: COLORS.cardSurface, borderRadius: 12, padding: 8 },
  priceRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  priceHead: { borderBottomWidth: 2, borderBottomColor: COLORS.forestGreen },
  priceCol: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
});
