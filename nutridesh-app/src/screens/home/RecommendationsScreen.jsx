import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import LottieLoader from '../../components/common/LottieLoader';
import { getRecommendations } from '../../services/api';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

export default function RecommendationsScreen({ navigation }) {
  const profile = useSelector((s) => s.profile.profile);
  const meals = useSelector((s) => s.mealLog.meals);
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getRecommendations(profile, {}, null);
      setRecs(res.recommendations);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="পুষ্টি পরামর্শ" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loaderWrap}>
          <LottieLoader label="আপনার জন্য সেরা খাবার বেছে নিচ্ছি..." />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
          <Text style={styles.intro}>আজকের বাকি খাবারের জন্য ৩টি পরামর্শ:</Text>
          {recs.map((r, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.emoji}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{r.meal_name_bn}</Text>
                <Text style={styles.reason}>{r.reason_bn}</Text>
                <View style={styles.tagRow}>
                  <Text style={styles.tag}>{toBanglaNumber(r.estimated_calories)} kcal</Text>
                  <Text style={styles.tag}>৳{toBanglaNumber(r.estimated_cost_bdt)}</Text>
                  {r.is_diabetic_safe && <Text style={[styles.tag, styles.safeTag]}>ডায়াবেটিক নিরাপদ</Text>}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  intro: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardSurface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  emoji: { fontSize: 36, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  reason: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    fontSize: 12,
    backgroundColor: COLORS.warmCream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  safeTag: { backgroundColor: '#E8F5E9', color: COLORS.forestGreen },
});
