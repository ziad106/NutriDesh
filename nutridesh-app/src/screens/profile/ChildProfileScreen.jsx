import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { addChildProfile } from '../../store/slices/profileSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

// Simplified WHO stunting/underweight check (illustrative for demo)
function assessChild({ ageMonths, weightKg, heightCm, gender }) {
  // very rough — for demo only; in production use WHO LMS tables
  const expectedWeight = gender === 'female' ? 3 + ageMonths * 0.4 : 3.2 + ageMonths * 0.42;
  const expectedHeight = gender === 'female' ? 49 + ageMonths * 1.2 : 50 + ageMonths * 1.25;
  const wAZ = (weightKg - expectedWeight) / (expectedWeight * 0.15);
  const hAZ = (heightCm - expectedHeight) / (expectedHeight * 0.05);
  const isUnderweight = wAZ < -2;
  const isStunted = hAZ < -2;
  let risk = 'low';
  if (isUnderweight || isStunted) risk = 'high';
  else if (wAZ < -1 || hAZ < -1) risk = 'medium';
  return { isUnderweight, isStunted, risk };
}

export default function ChildProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const children = useSelector((s) => s.profile.childProfiles);
  const [form, setForm] = useState({ name: '', ageMonths: '24', weight_kg: '10', height_cm: '85', gender: 'male' });
  const [result, setResult] = useState(null);

  function check() {
    const r = assessChild({
      ageMonths: Number(form.ageMonths),
      weightKg: Number(form.weight_kg),
      heightCm: Number(form.height_cm),
      gender: form.gender,
    });
    setResult(r);
  }

  function save() {
    if (!form.name) { Alert.alert('শিশুর নাম দিন'); return; }
    const dob = new Date(); dob.setMonth(dob.getMonth() - Number(form.ageMonths));
    dispatch(addChildProfile({
      name: form.name,
      date_of_birth: dob.toISOString(),
      gender: form.gender,
      weight_kg: Number(form.weight_kg),
      height_cm: Number(form.height_cm),
    }));
    Alert.alert('সংরক্ষণ হয়েছে', `${form.name} যোগ হয়েছে।`);
    setForm({ name: '', ageMonths: '24', weight_kg: '10', height_cm: '85', gender: 'male' });
    setResult(null);
  }

  const riskColor = result?.risk === 'high' ? COLORS.alertRed : result?.risk === 'medium' ? COLORS.moderateOrange : COLORS.forestGreen;

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="শিশু প্রোফাইল" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.section}>শিশুর তথ্য</Text>
        <TextInput style={styles.in} placeholder="নাম" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
        <View style={styles.row2}>
          <View style={styles.col}>
            <Text style={styles.lbl}>বয়স (মাস)</Text>
            <TextInput style={styles.in} keyboardType="numeric" value={form.ageMonths} onChangeText={(t) => setForm({ ...form, ageMonths: t })} />
          </View>
          <View style={styles.col}>
            <Text style={styles.lbl}>লিঙ্গ</Text>
            <View style={styles.genderRow}>
              {['male', 'female'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gChip, form.gender === g && styles.gChipActive]}
                  onPress={() => setForm({ ...form, gender: g })}
                >
                  <Text style={[styles.gChipText, form.gender === g && { color: '#fff' }]}>{g === 'male' ? 'ছেলে' : 'মেয়ে'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.row2}>
          <View style={styles.col}>
            <Text style={styles.lbl}>ওজন (কেজি)</Text>
            <TextInput style={styles.in} keyboardType="numeric" value={form.weight_kg} onChangeText={(t) => setForm({ ...form, weight_kg: t })} />
          </View>
          <View style={styles.col}>
            <Text style={styles.lbl}>উচ্চতা (সেমি)</Text>
            <TextInput style={styles.in} keyboardType="numeric" value={form.height_cm} onChangeText={(t) => setForm({ ...form, height_cm: t })} />
          </View>
        </View>

        <TouchableOpacity style={styles.cta} onPress={check}>
          <Text style={styles.ctaText}>মূল্যায়ন করুন</Text>
        </TouchableOpacity>

        {result && (
          <View style={[styles.resultCard, { borderLeftColor: riskColor }]}>
            <Text style={[styles.resultTitle, { color: riskColor }]}>
              {result.risk === 'high' ? 'উচ্চ ঝুঁকি ⚠️' : result.risk === 'medium' ? 'মাঝারি ঝুঁকি' : 'স্বাভাবিক ✅'}
            </Text>
            <Text style={styles.resultText}>
              {result.isUnderweight ? '• ওজন কম (Underweight)' : ''}
              {result.isStunted ? '\n• বৃদ্ধি কম (Stunting)' : ''}
              {!result.isUnderweight && !result.isStunted ? '• বৃদ্ধি ও ওজন স্বাভাবিক' : ''}
            </Text>
            <Text style={styles.resultHint}>{
              result.risk === 'high'
                ? 'একজন শিশু চিকিৎসকের সাথে পরামর্শ করুন। খিচুড়ি, ডিম, দুধ, মাছ যোগ করুন।'
                : 'প্রতিদিন ডিম, ডাল, ফল ও সবজি দিন। নিয়মিত স্বাস্থ্যসেবিকার সাথে চেক করুন।'
            }</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.clayOrange, marginTop: 12 }]} onPress={save}>
          <Text style={styles.ctaText}>প্রোফাইল সংরক্ষণ করুন</Text>
        </TouchableOpacity>

        {children.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.section}>সংরক্ষিত প্রোফাইল</Text>
            {children.map((c) => (
              <View key={c.id} style={styles.childCard}>
                <Text style={{ fontSize: 28, marginRight: 10 }}>👶</Text>
                <View>
                  <Text style={styles.childName}>{c.name}</Text>
                  <Text style={styles.childSub}>{toBanglaNumber(c.weight_kg)} কেজি · {toBanglaNumber(c.height_cm)} সেমি</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  in: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  row2: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { flex: 1, marginHorizontal: 4 },
  lbl: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  genderRow: { flexDirection: 'row' },
  gChip: { flex: 1, padding: 10, borderRadius: 10, backgroundColor: COLORS.cardSurface, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: 2, alignItems: 'center' },
  gChipActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  gChipText: { color: COLORS.textPrimary, fontSize: 14 },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultCard: { backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 12, marginTop: 14, borderLeftWidth: 4 },
  resultTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  resultText: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 8 },
  resultHint: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  childCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 12, marginBottom: 8 },
  childName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  childSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});
