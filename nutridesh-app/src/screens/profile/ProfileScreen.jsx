import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../../store/slices/authSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const ROWS = [
  { key: 'HealthProfileEdit', icon: '👤', label: 'হেলথ প্রোফাইল এডিট' },
  { key: 'FamilyMembers', icon: '👨‍👩‍👧', label: 'পরিবারের সদস্য' },
  { key: 'ChildProfile', icon: '👶', label: 'শিশু প্রোফাইল' },
  { key: 'DiabetesMode', icon: '🩺', label: 'ডায়াবেটিস মোড' },
  { key: 'PregnancyMode', icon: '🤱', label: 'গর্ভাবস্থা মোড' },
  { key: 'RamadanMode', icon: '🌙', label: 'রমজান মোড' },
  { key: 'ShasthoShebikaPortal', icon: '🏥', label: 'স্বাস্থ্য সহায়িকা পোর্টাল' },
  { key: 'Settings', icon: '⚙️', label: 'সেটিংস' },
  { key: 'Consent', icon: '🔒', label: 'গোপনীয়তা ও সম্মতি' },
];

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.profile);
  const meals = useSelector((s) => s.mealLog.meals);
  const streak = useSelector((s) => s.mealLog.streak);

  function doLogout() {
    Alert.alert('লগআউট', 'আপনি কি লগ আউট করতে চান?', [
      { text: 'বাতিল' },
      { text: 'হ্যাঁ', onPress: () => dispatch(logout()) },
    ]);
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <View style={styles.avatarBig}>
            <Text style={{ fontSize: 40 }}>🌿</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>
            {toBanglaNumber(profile.age)} বছর · {profile.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
          </Text>
          <View style={styles.statsRow}>
            <Stat label="স্ট্রিক" value={`🔥 ${toBanglaNumber(streak)}`} />
            <Stat label="মোট লগ" value={toBanglaNumber(meals.length)} />
            <Stat label="লক্ষ্য" value={`${toBanglaNumber(profile.calorie_target)} kcal`} />
          </View>
        </View>

        <View style={styles.list}>
          {ROWS.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={styles.row}
              onPress={() => navigation.navigate(r.key)}
            >
              <Text style={styles.icon}>{r.icon}</Text>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logout} onPress={doLogout}>
          <Text style={styles.logoutText}>লগ আউট</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NutriDesh v1.0.0 · বাংলাদেশের জন্য তৈরি 🇧🇩</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={statStyle.s}>
      <Text style={statStyle.v}>{value}</Text>
      <Text style={statStyle.l}>{label}</Text>
    </View>
  );
}

const statStyle = StyleSheet.create({
  s: { alignItems: 'center', flex: 1 },
  v: { fontSize: 17, fontWeight: '700', color: COLORS.forestGreen },
  l: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  header: { alignItems: 'center', paddingTop: 16, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: COLORS.cardSurface },
  avatarBig: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 16, alignSelf: 'stretch' },
  list: { backgroundColor: COLORS.cardSurface, marginTop: 16, marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon: { fontSize: 22, marginRight: 14 },
  label: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  arrow: { fontSize: 22, color: COLORS.textDisabled },
  logout: { marginTop: 24, marginHorizontal: 16, padding: 14, borderRadius: 12, backgroundColor: '#FCE4E4', alignItems: 'center' },
  logoutText: { color: COLORS.alertRed, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textDisabled, marginTop: 24 },
});
