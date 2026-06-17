import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setProfile } from '../../store/slices/profileSlice';
import { setOnboarded, login } from '../../store/slices/authSlice';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';

const STEPS = 5;

const GOAL_OPTIONS = [
  { key: 'lose', icon: '🏃', label: STRINGS.GOAL_LOSE },
  { key: 'maintain', icon: '⚖️', label: STRINGS.GOAL_MAINTAIN },
  { key: 'gain', icon: '💪', label: STRINGS.GOAL_GAIN },
  { key: 'medical', icon: '🏥', label: STRINGS.GOAL_MEDICAL },
];

const CONDITIONS = [
  { key: 'diabetes', label: 'ডায়াবেটিস' },
  { key: 'hypertension', label: 'উচ্চ রক্তচাপ' },
  { key: 'pregnancy', label: 'গর্ভাবস্থা' },
  { key: 'anaemia', label: 'রক্তশূন্যতা' },
  { key: 'child', label: 'শিশুর যত্ন' },
  { key: 'ramadan', label: 'রমজান' },
  { key: 'none', label: 'কিছু নেই' },
];

const MODES = [
  { key: 'student', icon: '👨‍🎓', label: 'ছাত্র ফিটনেস' },
  { key: 'gym', icon: '💪', label: 'জিম / মাসেল' },
  { key: 'diabetes', icon: '🩺', label: 'ডায়াবেটিক' },
  { key: 'pregnancy', icon: '🤱', label: 'গর্ভাবস্থা' },
  { key: 'elderly', icon: '👴', label: 'বয়স্ক' },
  { key: 'child', icon: '👶', label: 'শিশু' },
];

export default function ProfileWizardScreen({ navigation }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '28',
    gender: 'male',
    height_cm: '170',
    weight_kg: '65',
    goal: 'maintain',
    conditions: [],
    health_goal_mode: 'none',
  });

  function update(k, v) {
    setForm({ ...form, [k]: v });
  }
  function toggleCondition(c) {
    if (c === 'none') {
      setForm({ ...form, conditions: [] });
      return;
    }
    const has = form.conditions.includes(c);
    setForm({
      ...form,
      conditions: has ? form.conditions.filter((x) => x !== c) : [...form.conditions, c],
    });
  }

  function next() {
    if (step < STEPS - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }
  function back() {
    if (step === 0) return;
    setStep(step - 1);
  }
  function finish() {
    dispatch(
      setProfile({
        ...form,
        age: Number(form.age) || 28,
        height_cm: Number(form.height_cm) || 170,
        weight_kg: Number(form.weight_kg) || 65,
      })
    );
    dispatch(login({ name: form.name || 'বন্ধু', phone: '01700000000' }));
    dispatch(setOnboarded(true));
    navigation.replace('Main');
  }

  return (
    <View style={styles.box}>
      <View style={styles.topBar}>
        <Text style={styles.stepLabel}>
          ধাপ {step + 1} / {STEPS}
        </Text>
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skip}>{STRINGS.SKIP}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${((step + 1) / STEPS) * 100}%` }]} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 24 }}>
        {step === 0 && (
          <View>
            <Text style={styles.q}>{STRINGS.WIZ_NAME}</Text>
            <TextInput
              style={styles.input}
              placeholder="আপনার নাম"
              value={form.name}
              onChangeText={(t) => update('name', t)}
            />
            <Text style={styles.q}>{STRINGS.WIZ_AGE}</Text>
            <TextInput
              style={styles.input}
              placeholder="বয়স"
              keyboardType="numeric"
              value={form.age}
              onChangeText={(t) => update('age', t)}
            />
            <Text style={styles.q}>{STRINGS.WIZ_GENDER}</Text>
            <View style={styles.row}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => update('gender', g)}
                  style={[styles.chip, form.gender === g && styles.chipActive]}
                >
                  <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>
                    {g === 'male' ? STRINGS.MALE : g === 'female' ? STRINGS.FEMALE : STRINGS.OTHER}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.q}>{STRINGS.WIZ_HEIGHT}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.height_cm}
              onChangeText={(t) => update('height_cm', t)}
            />
            <Text style={styles.q}>{STRINGS.WIZ_WEIGHT}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.weight_kg}
              onChangeText={(t) => update('weight_kg', t)}
            />
            <Text style={styles.bmiHint}>
              BMI: {((Number(form.weight_kg) / Math.pow(Number(form.height_cm) / 100, 2)) || 0).toFixed(1)}
            </Text>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.q}>{STRINGS.WIZ_GOAL}</Text>
            {GOAL_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.key}
                onPress={() => update('goal', o.key)}
                style={[styles.goalCard, form.goal === o.key && styles.goalCardActive]}
              >
                <Text style={styles.goalIcon}>{o.icon}</Text>
                <Text style={styles.goalLabel}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.q}>স্বাস্থ্য সমস্যা</Text>
            <View style={styles.wrap}>
              {CONDITIONS.map((c) => {
                const active = form.conditions.includes(c.key);
                return (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => toggleCondition(c.key)}
                    style={[styles.chipBig, active && styles.chipBigActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.q}>হেলথ মোড</Text>
            <View style={styles.modeGrid}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  onPress={() => update('health_goal_mode', m.key)}
                  style={[
                    styles.modeCard,
                    form.health_goal_mode === m.key && styles.modeCardActive,
                  ]}
                >
                  <Text style={styles.modeIcon}>{m.icon}</Text>
                  <Text style={styles.modeLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity onPress={back} style={[styles.btn, styles.btnGhost]}>
            <Text style={styles.btnGhostText}>{STRINGS.BACK}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={next} style={[styles.btn, styles.btnPrimary]}>
          <Text style={styles.btnText}>
            {step === STEPS - 1 ? STRINGS.GET_STARTED : STRINGS.NEXT}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 8,
  },
  stepLabel: { fontSize: 14, color: COLORS.textSecondary },
  skip: { fontSize: 14, color: COLORS.textSecondary },
  progressBg: {
    height: 4,
    marginHorizontal: 24,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.forestGreen },
  body: { flex: 1 },
  q: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: COLORS.cardSurface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: { flexDirection: 'row', marginTop: 4 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  chipBig: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  chipBigActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  chipText: { fontSize: 15, color: COLORS.textPrimary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  goalCardActive: { borderColor: COLORS.forestGreen, backgroundColor: '#E8F5E9' },
  goalIcon: { fontSize: 32, marginRight: 12 },
  goalLabel: { fontSize: 17, color: COLORS.textPrimary, fontWeight: '500' },
  bmiHint: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  modeCard: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  modeCardActive: { borderColor: COLORS.forestGreen, backgroundColor: '#E8F5E9' },
  modeIcon: { fontSize: 40, marginBottom: 6 },
  modeLabel: { fontSize: 14, color: COLORS.textPrimary, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.warmCream,
  },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  btnPrimary: { backgroundColor: COLORS.forestGreen },
  btnGhost: { backgroundColor: COLORS.cardSurface, borderWidth: 1, borderColor: COLORS.border },
  btnText: { fontSize: 17, color: '#fff', fontWeight: '700' },
  btnGhostText: { fontSize: 17, color: COLORS.textPrimary },
});
