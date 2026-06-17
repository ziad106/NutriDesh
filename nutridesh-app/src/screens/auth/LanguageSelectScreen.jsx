import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../store/slices/authSlice';
import { COLORS } from '../../constants/colors';

export default function LanguageSelectScreen({ navigation }) {
  const dispatch = useDispatch();
  function choose(lang) {
    dispatch(setLanguage(lang));
    navigation.replace('Onboarding');
  }
  return (
    <View style={styles.box}>
      <Text style={styles.leaf}>🌿</Text>
      <Text style={styles.title}>ভাষা নির্বাচন করুন</Text>
      <Text style={styles.sub}>Choose your language</Text>
      <TouchableOpacity style={styles.btn} onPress={() => choose('bn')}>
        <Text style={styles.btnText}>বাংলা</Text>
        <Text style={styles.btnSub}>Bangla</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnAlt]} onPress={() => choose('en')}>
        <Text style={[styles.btnText, { color: COLORS.forestGreen }]}>English</Text>
        <Text style={[styles.btnSub, { color: COLORS.textSecondary }]}>ইংরেজি</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.warmCream, padding: 24 },
  leaf: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 40 },
  btn: {
    width: '100%',
    backgroundColor: COLORS.forestGreen,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  btnAlt: { backgroundColor: COLORS.cardSurface, borderWidth: 1, borderColor: COLORS.forestGreen },
  btnText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  btnSub: { fontSize: 13, color: '#FFFFFFAA', marginTop: 2 },
});
