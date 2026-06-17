import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const SEHRI = ['ডাল-ভাত', '১টি ডিম', 'ওটস + কলা', 'দই + খেজুর', 'রুটি + সবজি'];
const IFTAR = ['২টি খেজুর + পানি', 'ছোলা ভিজানো', 'ফলের সালাদ', 'লেবু পানি', 'দই / লাস্যি'];

export default function RamadanModeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="রমজান মোড 🌙" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <View style={styles.timeCard}>
          <View>
            <Text style={styles.timeLabel}>সেহরি শেষ</Text>
            <Text style={styles.time}>৪:৩০ AM</Text>
          </View>
          <View>
            <Text style={styles.timeLabel}>ইফতার</Text>
            <Text style={styles.time}>৬:১৫ PM</Text>
          </View>
        </View>

        <Section title="সেহরিতে কী খাবেন" items={SEHRI} hint="ধীর শক্তি দেয় এমন খাবার" />
        <Section title="ইফতারে কী খাবেন" items={IFTAR} hint="হাইড্রেশন + ভারসাম্য" />

        <View style={styles.warn}>
          <Text style={styles.warnText}>⚠️ ভাজা-পোড়া কম খান। খেজুরের পর মিষ্টি না খাওয়াই ভালো (বিশেষত ডায়াবেটিকদের জন্য)।</Text>
        </View>

        <Text style={styles.section}>হাইড্রেশন ট্র্যাকার</Text>
        <View style={styles.glassRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Text key={i} style={[styles.glass, i < 3 && { opacity: 1 }]}>💧</Text>
          ))}
        </View>
        <Text style={styles.note}>৩ / ৮ গ্লাস (ইফতার থেকে সেহরির মধ্যে)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, items, hint }) {
  return (
    <View style={styles.sec}>
      <Text style={styles.section}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
      {items.map((it, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.itemTxt}>• {it}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  timeCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF4E0',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  timeLabel: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },
  time: { fontSize: 22, fontWeight: '700', color: COLORS.clayOrange, marginTop: 4 },
  sec: { marginTop: 12 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8, marginBottom: 4 },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  item: { paddingVertical: 6 },
  itemTxt: { fontSize: 15, color: COLORS.textPrimary },
  warn: { backgroundColor: '#FCE4E4', padding: 12, borderRadius: 12, marginTop: 16 },
  warnText: { fontSize: 13, color: COLORS.alertRed, lineHeight: 20 },
  glassRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  glass: { fontSize: 32, opacity: 0.3, marginRight: 6 },
  note: { fontSize: 13, color: COLORS.textSecondary, marginTop: 8 },
});
