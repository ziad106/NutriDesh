import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { updateProfile } from '../../store/slices/profileSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const FOODS_TIPS = [
  '🥚 প্রতিদিন ১-২টি ডিম (প্রোটিন ও কোলিন)',
  '🥬 লাল শাক, পুঁই শাক — আয়রন ও ফোলেট',
  '🥛 দুধ / দই — ক্যালসিয়াম',
  '🐟 ছোট মাছ (পাবদা, মলা) — ক্যালসিয়াম',
  '🥭 মৌসুমি ফল — ভিটামিন C',
  '🥜 বাদাম, ছোলা — আয়রন',
];

const AVOID = [
  '🚫 কাঁচা মাছ / কাঁচা ডিম',
  '🚫 অতিরিক্ত ক্যাফেইন',
  '🚫 আঁশহীন প্রক্রিয়াজাত খাবার',
  '🚫 পেঁপে কাঁচা (সংকোচন ঘটাতে পারে)',
];

export default function PregnancyModeScreen({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.profile);
  const [week, setWeek] = useState(String(profile.gestational_week || '20'));

  function save() {
    dispatch(updateProfile({ gestational_week: Number(week) }));
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="গর্ভাবস্থা মোড 🤱" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <View style={styles.card}>
          <Text style={styles.section}>গর্ভাবস্থার সপ্তাহ</Text>
          <TextInput
            style={styles.in}
            keyboardType="numeric"
            value={week}
            onChangeText={setWeek}
            onBlur={save}
          />
          <Text style={styles.hint}>সপ্তাহ {toBanglaNumber(week)} · ত্রৈমাসিক {Number(week) <= 13 ? '১' : Number(week) <= 26 ? '২' : '৩'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>দৈনিক পুষ্টি লক্ষ্য</Text>
          <Row k="ক্যালরি" v={`${toBanglaNumber(profile.calorie_target + 300)} kcal`} />
          <Row k="প্রোটিন" v={`${toBanglaNumber(profile.protein_target_g + 25)} গ্রাম`} />
          <Row k="আয়রন" v="২৭ মিগ্রা" />
          <Row k="ফোলেট" v="৬০০ মাইক্রোগ্রাম" />
          <Row k="ক্যালসিয়াম" v="১০০০ মিগ্রা" />
        </View>

        <Text style={styles.h2}>সুপারিশকৃত খাবার</Text>
        {FOODS_TIPS.map((t, i) => (
          <View key={i} style={styles.tip}><Text style={styles.tipText}>{t}</Text></View>
        ))}

        <Text style={styles.h2}>এড়িয়ে চলুন</Text>
        {AVOID.map((t, i) => (
          <View key={i} style={[styles.tip, { backgroundColor: '#FCE4E4' }]}>
            <Text style={[styles.tipText, { color: COLORS.alertRed }]}>{t}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ k, v }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowK}>{k}</Text>
      <Text style={styles.rowV}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  card: { backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 14, marginBottom: 14 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.softTeal, marginBottom: 8 },
  in: { backgroundColor: COLORS.warmCream, padding: 12, borderRadius: 10, fontSize: 18, borderWidth: 1, borderColor: COLORS.border },
  hint: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  h2: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12, marginBottom: 8 },
  tip: { backgroundColor: '#E0F2F1', padding: 12, borderRadius: 10, marginBottom: 6 },
  tipText: { fontSize: 14, color: COLORS.textPrimary },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowK: { fontSize: 14, color: COLORS.textPrimary },
  rowV: { fontSize: 14, fontWeight: '600', color: COLORS.softTeal },
});
