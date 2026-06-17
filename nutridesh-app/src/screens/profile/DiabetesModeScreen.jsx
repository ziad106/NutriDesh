import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ScreenHeader from '../../components/common/ScreenHeader';
import GITrafficLight from '../../components/common/GITrafficLight';
import { addGlucose } from '../../store/slices/mealLogSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';
import { getMealsForDay, totalsFromMeals } from '../../utils/nutritionCalculator';

const READING_TYPES = [
  { k: 'fasting', l: 'খালি পেট' },
  { k: 'post_meal', l: 'খাবারের পর' },
  { k: 'random', l: 'যেকোনো সময়' },
  { k: 'bedtime', l: 'ঘুমানোর আগে' },
];

export default function DiabetesModeScreen({ navigation }) {
  const dispatch = useDispatch();
  const glucose = useSelector((s) => s.mealLog.glucoseLogs);
  const meals = useSelector((s) => s.mealLog.meals);
  const profile = useSelector((s) => s.profile.profile);
  const [reading, setReading] = useState('');
  const [rtype, setRtype] = useState('fasting');

  const todayMeals = useMemo(() => getMealsForDay(meals), [meals]);
  const todayTotals = useMemo(() => totalsFromMeals(todayMeals), [todayMeals]);

  // GI summary
  const giCounts = todayMeals.reduce((acc, m) => {
    const g = m.food?.giCat || 'low';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const totalMeals = todayMeals.length || 1;
  const giAvg = giCounts.high > totalMeals / 2 ? 'high' : giCounts.medium > totalMeals / 3 ? 'medium' : 'low';

  function logGlucose() {
    const v = parseFloat(reading);
    if (!v || v < 2 || v > 30) {
      Alert.alert('সঠিক রিডিং দিন (mmol/L)');
      return;
    }
    dispatch(addGlucose({ reading_mmol: v, reading_type: rtype }));
    setReading('');
    Alert.alert('সংরক্ষণ হয়েছে', `${v} mmol/L লগ হয়েছে।`);
  }

  async function generateReport() {
    const html = `
      <html><body style="font-family:-apple-system;padding:24px">
        <h1 style="color:#E6B325">🩺 NutriDesh — ডায়াবেটিস রিপোর্ট</h1>
        <p><b>রোগী:</b> ${profile.name}, ${profile.age} বছর</p>
        <h2>সাম্প্রতিক রিডিং</h2>
        ${glucose.slice(0, 10).map(g => `<div>${new Date(g.logged_at).toLocaleString()} — ${g.reading_mmol} mmol/L (${g.reading_type})</div>`).join('') || 'কোনো রিডিং নেই'}
        <h2>আজকের পুষ্টি</h2>
        <div>ক্যালরি: ${Math.round(todayTotals.calories)} kcal</div>
        <div>সোডিয়াম: ${Math.round(todayTotals.sodium)} mg</div>
        <p style="margin-top:24px;font-size:11px;color:#888">NutriDesh is not a medical device.</p>
      </body></html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('PDF এক্সপোর্ট ব্যর্থ', String(e));
    }
  }

  const sodiumHigh = todayTotals.sodium > 1500;

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="ডায়াবেটিস মোড 🩺" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.section}>আজকের গড় GI</Text>
        <View style={{ marginBottom: 12 }}>
          <GITrafficLight giCategory={giAvg} />
        </View>

        <Text style={styles.section}>গ্লুকোজ রিডিং লগ</Text>
        <TextInput
          style={styles.in}
          placeholder="মিমোল/লিটার (যেমন 6.5)"
          keyboardType="numeric"
          value={reading}
          onChangeText={setReading}
        />
        <View style={styles.row}>
          {READING_TYPES.map((t) => (
            <TouchableOpacity
              key={t.k}
              style={[styles.chip, rtype === t.k && styles.chipActive]}
              onPress={() => setRtype(t.k)}
            >
              <Text style={[styles.chipText, rtype === t.k && { color: '#fff' }]}>{t.l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={logGlucose}>
          <Text style={styles.ctaText}>+ লগ করুন</Text>
        </TouchableOpacity>

        {glucose.length > 0 && (
          <View>
            <Text style={[styles.section, { marginTop: 16 }]}>সাম্প্রতিক রিডিং</Text>
            {glucose.slice(0, 5).map((g) => (
              <View key={g.id} style={styles.gCard}>
                <Text style={styles.gReading}>{toBanglaNumber(g.reading_mmol)} mmol/L</Text>
                <Text style={styles.gType}>{READING_TYPES.find((t) => t.k === g.reading_type)?.l} · {new Date(g.logged_at).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.section, { marginTop: 16 }]}>আজকের খাবার (GI)</Text>
        {todayMeals.length === 0 && <Text style={styles.empty}>আজ এখনো লগ করা হয়নি।</Text>}
        {todayMeals.map((m) => (
          <View key={m.id} style={styles.mealRow}>
            <Text style={styles.mealEmoji}>{m.food?.emoji || '🍽️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealName}>{m.foodName}</Text>
              <GITrafficLight giCategory={m.food?.giCat || 'low'} />
            </View>
          </View>
        ))}

        {sodiumHigh && (
          <View style={styles.sodiumAlert}>
            <Text style={styles.sodiumIcon}>🧂</Text>
            <Text style={styles.sodiumText}>আজ লবণ বেশি হয়েছে ({toBanglaNumber(Math.round(todayTotals.sodium))} মিগ্রা)। উচ্চ রক্তচাপের ঝুঁকি।</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.softTeal, marginTop: 16 }]} onPress={generateReport}>
          <Text style={styles.ctaText}>📄 ডাক্তারের জন্য রিপোর্ট</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12, marginBottom: 8 },
  in: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: COLORS.cardSurface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginRight: 6, marginBottom: 6 },
  chipActive: { backgroundColor: COLORS.turmericYellow, borderColor: COLORS.turmericYellow },
  chipText: { fontSize: 13, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.turmericYellow, padding: 12, borderRadius: 10, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  gCard: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, marginBottom: 6 },
  gReading: { fontSize: 18, fontWeight: '700', color: COLORS.turmericYellow },
  gType: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  empty: { color: COLORS.textDisabled, textAlign: 'center', padding: 16 },
  mealRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, marginBottom: 6 },
  mealEmoji: { fontSize: 28, marginRight: 10 },
  mealName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  sodiumAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FCE4E4', padding: 12, borderRadius: 12, marginTop: 12 },
  sodiumIcon: { fontSize: 24, marginRight: 10 },
  sodiumText: { flex: 1, fontSize: 13, color: COLORS.alertRed, lineHeight: 20 },
});
