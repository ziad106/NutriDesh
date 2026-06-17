import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import FoodCard from '../../components/common/FoodCard';
import { COLORS } from '../../constants/colors';

export default function MealLogScreen({ navigation }) {
  const meals = useSelector((s) => s.mealLog.meals);

  const grouped = {};
  meals.forEach((m) => {
    const d = new Date(m.logged_at).toDateString();
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(m);
  });

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="খাবার লগ" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {Object.entries(grouped).map(([day, items]) => (
          <View key={day} style={{ marginBottom: 16 }}>
            <Text style={styles.date}>{day}</Text>
            {items.map((m) => (
              <FoodCard key={m.id} meal={m} />
            ))}
          </View>
        ))}
        {meals.length === 0 && <Text style={styles.empty}>এখনো কোনো খাবার লগ করা হয়নি।</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  scroll: { flex: 1 },
  date: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  empty: { textAlign: 'center', color: COLORS.textDisabled, marginTop: 64 },
});
