import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { setThemeMode } from '../../store/slices/uiSlice';
import { setLanguage } from '../../store/slices/authSlice';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const lang = useSelector((s) => s.auth.language);
  const theme = useSelector((s) => s.ui.themeMode);

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="সেটিংস" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Section title="সাধারণ">
          <Row label="ভাষা" right={
            <View style={{ flexDirection: 'row' }}>
              {['bn', 'en'].map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.langChip, lang === l && styles.langActive]}
                  onPress={() => dispatch(setLanguage(l))}
                >
                  <Text style={[styles.langText, lang === l && { color: '#fff' }]}>
                    {l === 'bn' ? 'বাংলা' : 'EN'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          } />
          <Row label="ডার্ক মোড" right={
            <Switch
              value={theme === 'dark'}
              onValueChange={(v) => dispatch(setThemeMode(v ? 'dark' : 'light'))}
              trackColor={{ false: COLORS.border, true: COLORS.forestGreen }}
            />
          } />
        </Section>

        <Section title="বিজ্ঞপ্তি">
          <Row label="মিল রিমাইন্ডার" right={<Switch value={true} onValueChange={() => {}} trackColor={{ true: COLORS.forestGreen }} />} />
          <Row label="ঘাটতি সতর্কতা" right={<Switch value={true} onValueChange={() => {}} trackColor={{ true: COLORS.forestGreen }} />} />
        </Section>

        <Section title="ডেটা">
          <TouchableOpacity style={styles.btnRow} onPress={() => Alert.alert('ক্যাশ ক্লিয়ার করা হয়েছে')}>
            <Text style={styles.btnText}>🗑️ ক্যাশ ক্লিয়ার করুন</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnRow} onPress={() => Alert.alert('ডেটা এক্সপোর্ট', 'JSON ফাইল হিসেবে এক্সপোর্ট করা হয়েছে।')}>
            <Text style={styles.btnText}>💾 ডেটা এক্সপোর্ট</Text>
          </TouchableOpacity>
        </Section>

        <Text style={styles.disclaimer}>
          ⚠️ NutriDesh চিকিৎসা যন্ত্র নয়। স্বাস্থ্য সংক্রান্ত সিদ্ধান্তের জন্য ডাক্তারের পরামর্শ নিন।
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.sec}>
      <Text style={styles.secTitle}>{title}</Text>
      <View style={styles.secBody}>{children}</View>
    </View>
  );
}

function Row({ label, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  sec: { marginBottom: 18 },
  secTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  secBody: { backgroundColor: COLORS.cardSurface, borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: 15, color: COLORS.textPrimary },
  btnRow: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  btnText: { fontSize: 15, color: COLORS.textPrimary },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: COLORS.warmCream, marginLeft: 6, borderWidth: 1, borderColor: COLORS.border },
  langActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  langText: { fontSize: 13, color: COLORS.textPrimary },
  disclaimer: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, padding: 12, backgroundColor: '#FFF4E0', borderRadius: 10 },
});
