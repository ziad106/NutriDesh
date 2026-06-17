import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { addFamilyMember, removeFamilyMember } from '../../store/slices/profileSlice';
import { COLORS } from '../../constants/colors';

const RELATIONS = ['spouse', 'child', 'parent', 'other'];
const REL_LABELS = { spouse: 'জীবনসঙ্গী', child: 'সন্তান', parent: 'মা/বাবা', other: 'অন্য' };

export default function FamilyMembersScreen({ navigation }) {
  const dispatch = useDispatch();
  const members = useSelector((s) => s.profile.familyMembers);
  const [name, setName] = useState('');
  const [rel, setRel] = useState('child');

  function add() {
    if (!name) {
      Alert.alert('নাম দিন');
      return;
    }
    dispatch(addFamilyMember({ name, relationship: rel }));
    setName('');
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="পরিবারের সদস্য" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.section}>নতুন সদস্য যোগ করুন</Text>
        <TextInput style={styles.in} placeholder="নাম" value={name} onChangeText={setName} />
        <View style={styles.row}>
          {RELATIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, rel === r && styles.chipActive]}
              onPress={() => setRel(r)}
            >
              <Text style={[styles.chipText, rel === r && { color: '#fff' }]}>{REL_LABELS[r]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={add}>
          <Text style={styles.ctaText}>+ যোগ করুন</Text>
        </TouchableOpacity>

        <Text style={[styles.section, { marginTop: 24 }]}>সদস্য তালিকা</Text>
        {members.length === 0 && <Text style={styles.empty}>এখনো কোনো সদস্য যোগ করা হয়নি।</Text>}
        {members.map((m) => (
          <View key={m.id} style={styles.memberCard}>
            <Text style={styles.memberEmoji}>👤</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberRel}>{REL_LABELS[m.relationship]}</Text>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeFamilyMember(m.id))}>
              <Text style={styles.delIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  in: { backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.cardSurface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: COLORS.forestGreen, borderColor: COLORS.forestGreen },
  chipText: { fontSize: 14, color: COLORS.textPrimary },
  cta: { backgroundColor: COLORS.forestGreen, padding: 12, borderRadius: 10, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
  empty: { color: COLORS.textDisabled, textAlign: 'center', padding: 24 },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardSurface, padding: 12, borderRadius: 12, marginBottom: 8 },
  memberEmoji: { fontSize: 26, marginRight: 12 },
  memberName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  memberRel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  delIcon: { fontSize: 20 },
});
