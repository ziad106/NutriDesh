import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { addMood } from '../../store/slices/mealLogSlice';
import { COLORS } from '../../constants/colors';

const MOODS = [
  { key: 'energetic', emoji: '😄', label: 'উদ্যমী' },
  { key: 'normal', emoji: '🙂', label: 'স্বাভাবিক' },
  { key: 'tired', emoji: '😴', label: 'ক্লান্ত' },
  { key: 'weak', emoji: '😪', label: 'দুর্বল' },
  { key: 'dizzy', emoji: '😵', label: 'মাথা ঘোরা' },
  { key: 'unwell', emoji: '🤒', label: 'অসুস্থ' },
];

export default function MoodEnergyScreen({ navigation }) {
  const dispatch = useDispatch();
  const moodLogs = useSelector((s) => s.mealLog.moodLogs);
  const [selected, setSelected] = useState(null);
  const [energy, setEnergy] = useState(3);

  function save() {
    if (!selected) {
      Alert.alert('মুড নির্বাচন করুন');
      return;
    }
    dispatch(addMood({ mood: selected, energy_level: energy }));
    Alert.alert('সংরক্ষণ হয়েছে', 'আপনার মুড লগ হয়েছে।');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="মুড / এনার্জি" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.q}>আজ কেমন লাগছে?</Text>
        <View style={styles.grid}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.moodCard, selected === m.key && styles.moodActive]}
              onPress={() => setSelected(m.key)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.q}>এনার্জি লেভেল (১-৫)</Text>
        <View style={styles.energyRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.eBtn, energy >= n && styles.eBtnFilled]}
              onPress={() => setEnergy(n)}
            >
              <Text style={[styles.eText, energy >= n && { color: '#fff' }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={save}>
          <Text style={styles.ctaText}>সংরক্ষণ করুন</Text>
        </TouchableOpacity>

        {moodLogs.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.section}>সাম্প্রতিক</Text>
            {moodLogs.slice(0, 5).map((m) => (
              <View key={m.id} style={styles.histCard}>
                <Text>{MOODS.find((x) => x.key === m.mood)?.emoji || '🙂'} {MOODS.find((x) => x.key === m.mood)?.label}</Text>
                <Text style={styles.histTime}>{new Date(m.logged_at).toLocaleString()}</Text>
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
  q: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 8, color: COLORS.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  moodActive: { borderColor: COLORS.forestGreen, backgroundColor: '#E8F5E9' },
  moodEmoji: { fontSize: 32 },
  moodLabel: { marginTop: 6, fontSize: 13, color: COLORS.textPrimary },
  energyRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  eBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.cardSurface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.border },
  eBtnFilled: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  eText: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  histCard: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, marginBottom: 8 },
  histTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
});
