import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

const FAMILIES = [
  { id: 1, name: 'রহমান পরিবার', visits: 3, risk: 'medium', members: 5 },
  { id: 2, name: 'আক্তার পরিবার', visits: 1, risk: 'high', members: 7 },
  { id: 3, name: 'হোসেন পরিবার', visits: 5, risk: 'low', members: 4 },
];

export default function ShasthoShebikaPortalScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  function verify() {
    if (pin === '1234') setUnlocked(true);
    else Alert.alert('ভুল PIN — ডেমো PIN: 1234');
  }

  async function genReport(fam) {
    const html = `
      <html><body style="font-family:-apple-system;padding:24px;color:#263238">
        <h1 style="color:#00796B">🏥 স্বাস্থ্য সহায়িকা রিপোর্ট</h1>
        <p><b>পরিবার:</b> ${fam.name}</p>
        <p><b>সদস্য:</b> ${fam.members}</p>
        <p><b>মোট পরিদর্শন:</b> ${fam.visits}</p>
        <p><b>ঝুঁকি:</b> ${fam.risk}</p>
        <h2>সুপারিশ</h2>
        <ul>
          <li>শিশুদের প্রতিদিন ডিম দিন</li>
          <li>গর্ভবতীদের আয়রন ট্যাবলেট</li>
          <li>লাল শাক, পুঁই শাক বাড়ান</li>
        </ul>
      </body></html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('PDF এক্সপোর্ট ব্যর্থ', String(e));
    }
  }

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.box} edges={['top']}>
        <ScreenHeader title="স্বাস্থ্য সহায়িকা পোর্টাল" onBack={() => navigation.goBack()} />
        <View style={styles.lockBox}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>PIN দিয়ে প্রবেশ করুন</Text>
          <TextInput
            style={styles.pinInput}
            placeholder="৪ ডিজিটের PIN"
            keyboardType="numeric"
            maxLength={4}
            value={pin}
            onChangeText={setPin}
            secureTextEntry
          />
          <TouchableOpacity style={styles.cta} onPress={verify}>
            <Text style={styles.ctaText}>প্রবেশ করুন</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>ডেমো PIN: 1234</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="স্বাস্থ্য সহায়িকা" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.section}>পরিবার তালিকা</Text>
        {FAMILIES.map((f) => (
          <TouchableOpacity key={f.id} style={styles.famCard} onPress={() => genReport(f)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.famName}>{f.name}</Text>
              <Text style={styles.famSub}>সদস্য: {toBanglaNumber(f.members)} · পরিদর্শন: {toBanglaNumber(f.visits)}</Text>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: f.risk === 'high' ? '#FCE4E4' : f.risk === 'medium' ? '#FFF4E0' : '#E8F5E9' }]}>
              <Text style={[styles.riskText, { color: f.risk === 'high' ? COLORS.alertRed : f.risk === 'medium' ? COLORS.clayOrange : COLORS.forestGreen }]}>
                {f.risk === 'high' ? 'উচ্চ' : f.risk === 'medium' ? 'মাঝারি' : 'কম'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.section, { marginTop: 16 }]}>দ্রুত মূল্যায়ন</Text>
        <TouchableOpacity style={styles.assess} onPress={() => navigation.navigate('ChildProfile')}>
          <Text style={styles.assessIcon}>👶</Text>
          <Text style={styles.assessLabel}>শিশু স্টান্টিং চেক</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assess} onPress={() => navigation.navigate('PregnancyMode')}>
          <Text style={styles.assessIcon}>🤱</Text>
          <Text style={styles.assessLabel}>গর্ভবতী পুষ্টি চেক</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  lockBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  lockIcon: { fontSize: 56, marginBottom: 16 },
  lockTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  pinInput: { width: 200, padding: 14, backgroundColor: COLORS.cardSurface, borderRadius: 10, fontSize: 20, textAlign: 'center', borderWidth: 1, borderColor: COLORS.border, marginBottom: 14, letterSpacing: 8 },
  cta: { backgroundColor: COLORS.softTeal, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  hint: { marginTop: 12, color: COLORS.textDisabled, fontSize: 12 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  famCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 12, marginBottom: 8 },
  famName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  famSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  riskText: { fontSize: 12, fontWeight: '700' },
  assess: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 12, marginBottom: 8 },
  assessIcon: { fontSize: 26, marginRight: 12 },
  assessLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
});
