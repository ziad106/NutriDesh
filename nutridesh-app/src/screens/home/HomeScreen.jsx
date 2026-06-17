import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { STRINGS, toBanglaNumber } from '../../constants/strings';
import NutritionRing from '../../components/common/NutritionRing';
import MacroPill from '../../components/common/MacroPill';
import MicronutrientChip from '../../components/common/MicronutrientChip';
import FoodCard from '../../components/common/FoodCard';
import InsightCard from '../../components/common/InsightCard';
import ModeChip from '../../components/common/ModeChip';
import QuickActionButton from '../../components/common/QuickActionButton';
import DeficiencyAlert from '../../components/common/DeficiencyAlert';
import {
  totalsFromMeals,
  getMealsForDay,
  greetingForHour,
  percentOf,
} from '../../utils/nutritionCalculator';
import { getSeasonalFoods } from '../../data/foodsBD';

export default function HomeScreen({ navigation }) {
  const profile = useSelector((s) => s.profile.profile);
  const meals = useSelector((s) => s.mealLog.meals);
  const streak = useSelector((s) => s.mealLog.streak);

  const todayMeals = useMemo(() => getMealsForDay(meals), [meals]);
  const totals = useMemo(() => totalsFromMeals(todayMeals), [todayMeals]);

  const calRemain = Math.max(0, (profile.calorie_target || 1800) - totals.calories);
  const progress = (totals.calories / (profile.calorie_target || 1800)) || 0;

  const greeting = greetingForHour(new Date().getHours());

  const ironPct = percentOf(totals.iron, profile.iron_target_mg);
  const caPct = percentOf(totals.calcium, profile.calcium_target_mg);
  const vaPct = percentOf(totals.vitA, profile.vitA_target_mcg);
  const folPct = percentOf(totals.folate, profile.folate_target_mcg);

  const activeMode =
    profile.conditions?.includes('diabetes') ? 'diabetes'
    : profile.conditions?.includes('pregnancy') ? 'pregnancy'
    : profile.conditions?.includes('hypertension') ? 'hypertension'
    : profile.conditions?.includes('anaemia') ? 'anaemia'
    : profile.conditions?.includes('ramadan') ? 'ramadan'
    : profile.conditions?.includes('child') ? 'child'
    : null;

  const seasonal = useMemo(() => getSeasonalFoods('year-round'), []);

  const insight =
    ironPct < 50
      ? 'গত ৩ দিন আপনার আয়রন কম — আজ পুঁই শাক বা ছোট মাছ খান।'
      : caPct < 50
      ? 'ক্যালসিয়াম কম — দুধ, দই বা শুটকি যোগ করুন।'
      : 'আজকের পুষ্টি ভারসাম্যপূর্ণ। একটি ফল যোগ করতে পারেন।';

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>{greeting},</Text>
            <Text style={styles.name}>{profile.name || 'বন্ধু'} 🌿</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakNum}>{toBanglaNumber(streak)}</Text>
          </View>
        </View>

        {/* MODE CHIP */}
        {activeMode && (
          <View style={styles.modeRow}>
            <ModeChip
              mode={activeMode}
              onPress={() => {
                if (activeMode === 'diabetes') navigation.navigate('DiabetesMode');
                else if (activeMode === 'pregnancy') navigation.navigate('PregnancyMode');
                else if (activeMode === 'ramadan') navigation.navigate('RamadanMode');
              }}
            />
          </View>
        )}

        {/* AI INSIGHT */}
        <InsightCard message={insight} />

        {/* RING */}
        <View style={styles.ringWrap}>
          <NutritionRing
            progress={Math.min(1, progress)}
            caloriesRemaining={calRemain}
            caloriesTotal={profile.calorie_target}
            caloriesConsumed={totals.calories}
          />
        </View>

        {/* MACROS */}
        <View style={styles.macrosRow}>
          <MacroPill
            label={STRINGS.PROTEIN}
            value={totals.protein}
            target={profile.protein_target_g}
            color={COLORS.forestGreen}
          />
          <MacroPill
            label={STRINGS.CARBS}
            value={totals.carbs}
            target={profile.carbs_target_g}
            color={COLORS.clayOrange}
          />
          <MacroPill
            label={STRINGS.FAT}
            value={totals.fat}
            target={profile.fat_target_g}
            color={COLORS.turmericYellow}
          />
        </View>

        {/* MICROS */}
        <Text style={styles.sectionTitle}>মাইক্রোনিউট্রিয়েন্ট</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <MicronutrientChip icon="🦴" label="ক্যালসিয়াম" percent={caPct} />
          <MicronutrientChip icon="💧" label="আয়রন" percent={ironPct} />
          <MicronutrientChip icon="☀️" label="ভিটামিন A" percent={vaPct} />
          <MicronutrientChip icon="🌿" label="ফোলেট" percent={folPct} />
        </ScrollView>

        {/* DEFICIENCY */}
        {ironPct < 40 && (
          <DeficiencyAlert
            message={STRINGS.IRON_LOW}
            onPress={() => navigation.navigate('Recommendations')}
          />
        )}

        {/* MEALS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{STRINGS.TODAY_MEALS}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MealLog')}>
            <Text style={styles.seeAll}>সব দেখুন</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          {todayMeals.length === 0 && (
            <Text style={styles.empty}>আজ এখনো কিছু লগ করা হয়নি।</Text>
          )}
          {todayMeals.map((m) => (
            <FoodCard key={m.id} meal={m} />
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{STRINGS.QUICK_ACTIONS}</Text>
        <View style={styles.qa}>
          <QuickActionButton
            emoji="📷"
            label={STRINGS.QA_SCAN}
            onPress={() => navigation.navigate('Scan')}
          />
          <QuickActionButton
            emoji="💬"
            label={STRINGS.QA_CHAT}
            color={COLORS.softTeal}
            onPress={() => navigation.navigate('Chat')}
          />
          <QuickActionButton
            emoji="💰"
            label={STRINGS.QA_BUDGET}
            color={COLORS.clayOrange}
            onPress={() => navigation.navigate('BudgetMeal')}
          />
          <QuickActionButton
            emoji="🥘"
            label={STRINGS.QA_COOK}
            color={COLORS.terracotta}
            onPress={() => navigation.navigate('WhatCanICook')}
          />
        </View>

        {/* SEASONAL */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>{STRINGS.SEASONAL} 🌿</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {seasonal.map((f) => (
            <View key={f.id} style={styles.seasCard}>
              <Text style={styles.seasEmoji}>{f.emoji}</Text>
              <Text style={styles.seasName}>{f.name_bn}</Text>
              <Text style={styles.seasPrice}>৳{toBanglaNumber(f.price)}/১০০গ্রাম</Text>
            </View>
          ))}
        </ScrollView>

        {/* MORE */}
        <View style={styles.moreRow}>
          <TouchableOpacity style={styles.moreBtn} onPress={() => navigation.navigate('WeeklyReport')}>
            <Text style={styles.moreIcon}>📊</Text>
            <Text style={styles.moreLabel}>সাপ্তাহিক রিপোর্ট</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreBtn} onPress={() => navigation.navigate('MoodEnergy')}>
            <Text style={styles.moreIcon}>😊</Text>
            <Text style={styles.moreLabel}>মুড / এনার্জি</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  hi: { fontSize: 14, color: COLORS.textSecondary },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginTop: 2 },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakIcon: { fontSize: 18, marginRight: 4 },
  streakNum: { fontSize: 16, fontWeight: '700', color: COLORS.clayOrange },
  modeRow: { paddingHorizontal: 20, flexDirection: 'row' },
  ringWrap: { alignItems: 'center', marginVertical: 16 },
  macrosRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  seeAll: { color: COLORS.forestGreen, fontSize: 14, fontWeight: '600' },
  empty: { textAlign: 'center', color: COLORS.textDisabled, paddingVertical: 24 },
  qa: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
  seasCard: {
    width: 110,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  seasEmoji: { fontSize: 36 },
  seasName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginTop: 4, textAlign: 'center' },
  seasPrice: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  moreRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16 },
  moreBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSurface,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  moreIcon: { fontSize: 22, marginRight: 8 },
  moreLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
});
