import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { updateProfile, toggleCondition } from '../../store/slices/profileSlice';
import { COLORS } from '../../constants/colors';

const CONDITIONS = ['diabetes', 'hypertension', 'pregnancy', 'anaemia', 'ramadan', 'child'];
const COND_LABELS = {
  diabetes: 'ডায়াবেটিস',
  hypertension: 'উচ্চ রক্তচাপ',
  pregnancy: 'গর্ভাবস্থা',
  anaemia: 'রক্তশূন্যতা',
  ramadan: 'রমজান',
  child: 'শিশুর যত্ন',
};

export default function HealthProfileEditScreen({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.profile);
  const [form, setForm] = useState({
    name: profile.name,
    age: String(profile.age),
    height_cm: String(profile.height_cm),
    weight_kg: String(profile.weight_kg),
    activity_level: profile.activity_level,
    goal: profile.goal,
  });

  function save() {
    dispatch(updateProfile({
      ...form,
      age: Number(form.age),
      height_cm: Number(form.height_cm),
      weight_kg: Number(form.weight_kg),
    }));
    Alert.alert('সংরক্ষণ হয়েছে', 'আপনার প্রোফাইল আপডেট হয়েছে।');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="প্রোফাইল এডিট" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Label l="নাম" />
        <TextInput style={styles.in} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
        <Label l="বয়স" />
        <TextInput style={styles.in} keyboardType="numeric" value={form.age} onChangeText={(t) => setForm({ ...form, age: t })} />
        <Label l="উচ্চতা (সেমি)" />
        <TextInput style={styles.in} keyboardType="numeric" value={form.height_cm} onChangeText={(t) => setForm({ ...form, height_cm: t })} />
        <Label l="ওজন (কেজি)" />
        <TextInput style={styles.in} keyboardType="numeric" value={form.weight_kg} onChangeText={(t) => setForm({ ...form, weight_kg: t })} />

        <Label l="শারীরিক সক্রিয়তা" />
        <View style={styles.row}>
          {[
            { k: 'sedentary', l: 'অলস' },
            { k: 'light', l: 'হালকা' },
            { k: 'moderate', l: 'মাঝারি' },
            { k: 'active', l: 'সক্রিয়' },
          ].map((o) => (
            <TouchableOpacity
              key={o.k}
              style={[styles.chip, form.activity_level === o.k && styles.chipActive]}
              onPress={() => setForm({ ...form, activity_level: o.k })}
            >
              <Text style={[styles.chipText, form.activity_level === o.k && { color: '#fff' }]}>{o.l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label l="স্বাস্থ্য সমস্যা" />
        <View style={styles.row}>
          {CONDITIONS.map((c) => {
            const active = profile.conditions.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => dispatch(toggleCondition(c))}
              >
                <Text style={[styles.chipText, active && { color: '#fff' }]}>{COND_LABELS[c]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.cta} onPress={save}>
          <Text style={styles.ctaText}>সংরক্ষণ করুন</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ l }) {
  return <Text style={styles.label}>{l}</Text>;
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginTop: 14, marginBottom: 6 },
  in: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.cardSurface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  chipText: { fontSize: 14, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
