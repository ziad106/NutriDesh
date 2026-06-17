import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../../components/common/ScreenHeader';
import GITrafficLight from '../../components/common/GITrafficLight';
import { addMeals } from '../../store/slices/mealLogSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';
import { FOODS_BD, getFoodById } from '../../data/foodsBD';

export default function ScanResultScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.profile);
  const result = route.params?.result;
  const mealType = route.params?.mealType || 'lunch';

  const [items, setItems] = useState(
    (result?.items || []).map((it) => {
      const matched =
        FOODS_BD.find(
          (f) =>
            f.name_en.toLowerCase() === it.food_name_en?.toLowerCase() ||
            f.name_bn === it.food_name_bn ||
            f.id === it.food_id
        ) || null;
      return {
        ...it,
        portion_g: it.estimated_quantity_g || 100,
        matched,
      };
    })
  );

  const totals = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        if (!it.matched) return acc;
        const f = (it.portion_g || 100) / 100;
        acc.cal += (it.matched.calories || 0) * f;
        acc.p += (it.matched.protein || 0) * f;
        acc.c += (it.matched.carbs || 0) * f;
        acc.fat += (it.matched.fat || 0) * f;
        return acc;
      },
      { cal: 0, p: 0, c: 0, fat: 0 }
    );
  }, [items]);

  function changePortion(idx, delta) {
    const next = [...items];
    next[idx] = { ...next[idx], portion_g: Math.max(20, (next[idx].portion_g || 100) + delta) };
    setItems(next);
  }

  function setPortionPreset(idx, val) {
    const next = [...items];
    next[idx] = { ...next[idx], portion_g: val };
    setItems(next);
  }

  function logMeal() {
    if (items.length === 0) return;
    const payloads = items.map((it) => ({
      foodId: it.matched?.id,
      food: it.matched,
      foodName: it.food_name_bn,
      mealType,
      portion_g: it.portion_g,
      scan_method: 'camera',
    }));
    dispatch(addMeals(payloads));
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    Alert.alert('লগ হয়েছে! ✅', 'আপনার পুষ্টি ট্র্যাক আপডেট হয়েছে।', [
      { text: 'ঠিক আছে', onPress: () => navigation.navigate('Home') },
    ]);
  }

  const hasDiabetes = profile.conditions?.includes('diabetes');
  const worstGI = items.reduce((acc, it) => {
    const order = { low: 0, medium: 1, high: 2 };
    const g = it.matched?.giCat || 'low';
    return order[g] > order[acc] ? g : acc;
  }, 'low');

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="স্ক্যান ফলাফল" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.intro}>{result?.plate_description_bn}</Text>

        {hasDiabetes && (
          <View style={{ marginVertical: 8 }}>
            <GITrafficLight giCategory={worstGI} />
          </View>
        )}

        {items.map((it, idx) => (
          <View key={idx} style={styles.itemCard}>
            <View style={styles.itemHead}>
              <Text style={styles.itemEmoji}>{it.emoji || it.matched?.emoji || '🍽️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{it.food_name_bn}</Text>
                <Text style={styles.itemSub}>{it.food_name_en}</Text>
              </View>
              <View style={[styles.conf, conf(it.confidence)]}>
                <Text style={styles.confText}>{confLabel(it.confidence)}</Text>
              </View>
            </View>
            <Text style={styles.portionLabel}>পরিমাণ: {toBanglaNumber(it.portion_g)} গ্রাম</Text>
            <View style={styles.portionRow}>
              <TouchableOpacity style={styles.pBtn} onPress={() => changePortion(idx, -20)}>
                <Text style={styles.pBtnText}>−</Text>
              </TouchableOpacity>
              {[80, 150, 250].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.pPreset, it.portion_g === v && styles.pPresetActive]}
                  onPress={() => setPortionPreset(idx, v)}
                >
                  <Text style={[styles.pPresetText, it.portion_g === v && { color: '#fff' }]}>
                    {toBanglaNumber(v)}g
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.pBtn} onPress={() => changePortion(idx, 20)}>
                <Text style={styles.pBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {it.matched && (
              <View style={styles.nutriRow}>
                <Text style={styles.nutriItem}>
                  {toBanglaNumber(Math.round((it.matched.calories * it.portion_g) / 100))} kcal
                </Text>
                <Text style={styles.nutriItem}>
                  P {toBanglaNumber(Math.round((it.matched.protein * it.portion_g) / 100))}g
                </Text>
                <Text style={styles.nutriItem}>
                  C {toBanglaNumber(Math.round((it.matched.carbs * it.portion_g) / 100))}g
                </Text>
                <GITrafficLight giCategory={it.matched.giCat || 'low'} />
              </View>
            )}
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalTitle}>মোট পুষ্টি</Text>
          <View style={styles.totalRow}>
            <Stat label="kcal" value={Math.round(totals.cal)} />
            <Stat label="প্রোটিন" value={Math.round(totals.p) + 'g'} />
            <Stat label="কার্ব" value={Math.round(totals.c) + 'g'} />
            <Stat label="চর্বি" value={Math.round(totals.fat) + 'g'} />
          </View>
        </View>

        <TouchableOpacity style={styles.cta} onPress={logMeal}>
          <Text style={styles.ctaText}>লগ করুন ✅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.altBtn} onPress={() => navigation.navigate('FoodSearch')}>
          <Text style={styles.altText}>সঠিক নয়? এডিট করুন</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={statStyles.num}>{toBanglaNumber(value)}</Text>
      <Text style={statStyles.lbl}>{label}</Text>
    </View>
  );
}

function conf(level) {
  if (level === 'high') return { backgroundColor: '#E8F5E9' };
  if (level === 'medium') return { backgroundColor: '#FFF4E0' };
  return { backgroundColor: '#FCE4E4' };
}
function confLabel(level) {
  return level === 'high' ? '✅ নিশ্চিত' : level === 'medium' ? '⚠️ সম্ভব' : '❓ অনিশ্চিত';
}

const statStyles = StyleSheet.create({
  num: { fontSize: 18, fontWeight: '700', color: COLORS.forestGreen },
  lbl: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  intro: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '600', marginBottom: 12 },
  itemCard: { backgroundColor: COLORS.cardSurface, padding: 14, borderRadius: 14, marginBottom: 12 },
  itemHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemEmoji: { fontSize: 36, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  itemSub: { fontSize: 12, color: COLORS.textSecondary },
  conf: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  confText: { fontSize: 11, fontWeight: '600' },
  portionLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  portionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  pBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.warmCream, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pBtnText: { fontSize: 22, color: COLORS.textPrimary },
  pPreset: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: COLORS.warmCream, marginHorizontal: 4, borderWidth: 1, borderColor: COLORS.border },
  pPresetActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  pPresetText: { fontSize: 13, color: COLORS.textPrimary },
  nutriRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  nutriItem: { fontSize: 12, marginRight: 10, color: COLORS.textPrimary, fontWeight: '600' },
  totalCard: { backgroundColor: '#E8F5E9', padding: 14, borderRadius: 14, marginTop: 8 },
  totalTitle: { fontSize: 14, fontWeight: '700', color: COLORS.forestGreen, marginBottom: 8 },
  totalRow: { flexDirection: 'row' },
  cta: { backgroundColor: COLORS.forestGreen, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  altBtn: { padding: 12, alignItems: 'center', marginTop: 8 },
  altText: { color: COLORS.forestGreen, fontSize: 14, fontWeight: '600' },
});
