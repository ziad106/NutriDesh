import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, setOnboarded } from '../../store/slices/authSlice';
import { COLORS } from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone');

  function sendOtp() {
    if (phone.length < 10) {
      Alert.alert('সঠিক ফোন নম্বর দিন');
      return;
    }
    setStage('otp');
    Alert.alert('OTP পাঠানো হয়েছে', 'ডেমো OTP: 1234');
  }

  function verify() {
    if (otp !== '1234') {
      Alert.alert('ভুল OTP — ডেমোতে 1234 ব্যবহার করুন');
      return;
    }
    dispatch(login({ phone }));
    dispatch(setOnboarded(true));
    navigation.replace('Main');
  }

  return (
    <View style={styles.box}>
      <Text style={styles.leaf}>🌿</Text>
      <Text style={styles.title}>NutriDesh-এ স্বাগতম</Text>
      <Text style={styles.sub}>ফোন নম্বর দিয়ে শুরু করুন</Text>

      {stage === 'phone' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="০১৭xxxxxxxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.cta} onPress={sendOtp}>
            <Text style={styles.ctaText}>OTP পাঠান</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP (ডেমো: 1234)"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            maxLength={4}
          />
          <TouchableOpacity style={styles.cta} onPress={verify}>
            <Text style={styles.ctaText}>ভেরিফাই করুন</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: COLORS.warmCream },
  leaf: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 },
  input: {
    width: '100%',
    backgroundColor: COLORS.cardSurface,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  cta: { width: '100%', backgroundColor: COLORS.forestGreen, padding: 16, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
