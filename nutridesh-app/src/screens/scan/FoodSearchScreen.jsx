import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { FOODS_BD, findFood } from '../../data/foodsBD';
import { addMeal } from '../../store/slices/mealLogSlice';
import { COLORS } from '../../constants/colors';
import { toBanglaNumber } from '../../constants/strings';

export default function FoodSearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const [q, setQ] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const results = useMemo(() => (q ? findFood(q) : FOODS_BD.slice(0, 30)), [q]);

  function quickLog(food) {
    dispatch(
      addMeal({
        foodId: food.id,
        food,
        foodName: food.name_bn,
        mealType,
        portion_g: 100,
        scan_method: 'manual',
      })
    );
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="খাবার খুঁজুন" onBack={() => navigation.goBack()} />
      <View style={{ padding: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="খাবারের নাম লিখুন (বাংলা বা English)..."
          value={q}
          onChangeText={setQ}
        />
        <View style={styles.mealRow}>
          {['breakfast', 'lunch', 'dinner', 'snack'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.mealChip, mealType === m && styles.mealChipActive]}
              onPress={() => setMealType(m)}
            >
              <Text style={[styles.mealChipText, mealType === m && { color: '#fff' }]}>
                {m === 'breakfast' ? 'সকাল' : m === 'lunch' ? 'দুপুর' : m === 'dinner' ? 'রাত' : 'স্ন্যাক'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => quickLog(item)}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name_bn}</Text>
              <Text style={styles.sub}>{item.name_en} · {toBanglaNumber(item.calories)} kcal/১০০গ্রাম</Text>
            </View>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  input: { backgroundColor: COLORS.cardSurface, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  mealRow: { flexDirection: 'row', marginTop: 10 },
  mealChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.cardSurface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  mealChipActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  mealChipText: { fontSize: 13, color: COLORS.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 12, marginBottom: 8 },
  emoji: { fontSize: 30, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  sub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  plus: { fontSize: 28, color: COLORS.forestGreen, fontWeight: '700', marginLeft: 8 },
});
