import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';
import { totalsFromMeals, getMealsForLastDays } from '../../utils/nutritionCalculator';

export default function WeeklyReportScreen({ navigation }) {
  const profile = useSelector((s) => s.profile.profile);
  const meals = useSelector((s) => s.mealLog.meals);

  const last7 = useMemo(() => getMealsForLastDays(meals, 7), [meals]);
  const totals = useMemo(() => totalsFromMeals(last7), [last7]);
  const days = 7;
  const avgCal = Math.round(totals.calories / days);
  const avgProtein = Math.round((totals.protein / days) * 10) / 10;
  const avgIron = Math.round((totals.iron / days) * 100) / 100;
  const avgCalcium = Math.round(totals.calcium / days);

  async function exportPDF() {
    const html = `
      <html><head><meta charset="utf-8"><style>
        body { font-family: -apple-system, sans-serif; padding: 32px; color: #263238; }
        h1 { color: #2E7D32; }
        .row { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        .label { color: #455A64; }
        .val { font-weight: 700; }
        .header { background: #F8F5EF; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
      </style></head><body>
        <h1>🌿 NutriDesh — Weekly Report</h1>
        <div class="header">
          <div><b>Name:</b> ${profile.name}</div>
          <div><b>Age:</b> ${profile.age}</div>
          <div><b>Goal:</b> ${profile.goal}</div>
          <div><b>Conditions:</b> ${(profile.conditions || []).join(', ') || 'None'}</div>
        </div>
        <h2>7-Day Averages</h2>
        <div class="row"><span class="label">Calories</span><span class="val">${avgCal} kcal/day</span></div>
        <div class="row"><span class="label">Protein</span><span class="val">${avgProtein} g/day</span></div>
        <div class="row"><span class="label">Iron</span><span class="val">${avgIron} mg/day</span></div>
        <div class="row"><span class="label">Calcium</span><span class="val">${avgCalcium} mg/day</span></div>
        <div class="row"><span class="label">Sodium</span><span class="val">${Math.round(totals.sodium / days)} mg/day</span></div>
        <p style="margin-top:24px;color:#90A4AE;font-size:12px">
          NutriDesh is not a medical device. Consult a doctor for health decisions.
        </p>
      </body></html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      } else {
        Alert.alert('PDF তৈরি হয়েছে', uri);
      }
    } catch (e) {
      Alert.alert('PDF এক্সপোর্ট ব্যর্থ', String(e));
    }
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="সাপ্তাহিক রিপোর্ট" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={styles.title}>গত ৭ দিনের গড়</Text>
        <View style={styles.card}>
          <Row label="ক্যালরি" value={`${toBanglaNumber(avgCal)} kcal`} target={`${toBanglaNumber(profile.calorie_target)} kcal`} />
          <Row label="প্রোটিন" value={`${toBanglaNumber(avgProtein)}গ্রাম`} target={`${toBanglaNumber(profile.protein_target_g)}গ্রাম`} />
          <Row label="আয়রন" value={`${toBanglaNumber(avgIron)}মিগ্রা`} target={`${toBanglaNumber(profile.iron_target_mg)}মিগ্রা`} />
          <Row label="ক্যালসিয়াম" value={`${toBanglaNumber(avgCalcium)}মিগ্রা`} target={`${toBanglaNumber(profile.calcium_target_mg)}মিগ্রা`} />
          <Row label="সোডিয়াম" value={`${toBanglaNumber(Math.round(totals.sodium / days))}মিগ্রা`} target={`< ${toBanglaNumber(profile.sodium_cap_mg)}মিগ্রা`} />
        </View>
        <Text style={styles.title}>মোট লগ</Text>
        <View style={styles.card}>
          <Text style={styles.note}>{toBanglaNumber(last7.length)}টি খাবার লগ করা হয়েছে।</Text>
        </View>
        <TouchableOpacity style={styles.cta} onPress={exportPDF}>
          <Text style={styles.ctaText}>📄 PDF এক্সপোর্ট করুন</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, target }) {
  return (
    <View style={styles.row}>
      <Text style={styles.lbl}>{label}</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.val}>{value}</Text>
        <Text style={styles.target}>লক্ষ্য: {target}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  title: { fontSize: 16, fontWeight: '700', marginVertical: 12, color: COLORS.textPrimary },
  card: { backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  lbl: { fontSize: 15, color: COLORS.textPrimary },
  val: { fontSize: 15, fontWeight: '700', color: COLORS.forestGreen },
  target: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  note: { fontSize: 14, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
