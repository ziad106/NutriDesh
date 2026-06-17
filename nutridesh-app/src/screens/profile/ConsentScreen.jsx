import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/colors';

export default function ConsentScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <ScreenHeader title="গোপনীয়তা ও সম্মতি" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.h1}>আপনার তথ্যের নিরাপত্তা</Text>
        <Text style={styles.p}>
          NutriDesh আপনার ব্যক্তিগত স্বাস্থ্য তথ্য (নাম, বয়স, ওজন, খাবার লগ) সংরক্ষণ করে শুধুমাত্র আপনার নিজস্ব ব্যবহারের জন্য। আমরা:
        </Text>
        <Bullet text="আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না" />
        <Bullet text="বিজ্ঞাপনের জন্য আপনার ডেটা ব্যবহার করি না" />
        <Bullet text="Row Level Security (RLS) দিয়ে আপনার ডেটা এনক্রিপ্ট করি" />
        <Bullet text="যেকোনো সময় আপনি আপনার সব ডেটা মুছতে পারেন" />

        <Text style={styles.h1}>চিকিৎসা সংক্রান্ত দায়বদ্ধতা</Text>
        <Text style={styles.p}>
          NutriDesh একটি পুষ্টি ট্র্যাকিং অ্যাপ — এটি চিকিৎসা যন্ত্র (medical device) নয়। অ্যাপের পরামর্শ পেশাদার ডাক্তারের পরামর্শের বিকল্প নয়।
        </Text>
        <Text style={styles.p}>
          ডায়াবেটিস, গর্ভাবস্থা, বা যেকোনো গুরুতর স্বাস্থ্য পরিস্থিতিতে দয়া করে রেজিস্টার্ড পুষ্টিবিদ বা চিকিৎসকের পরামর্শ নিন।
        </Text>

        <Text style={styles.h1}>AI ব্যবহার</Text>
        <Text style={styles.p}>
          খাবার শনাক্তকরণ ও পরামর্শের জন্য Google Gemini AI ব্যবহার করা হয়। আপনার খাবারের ছবি বিশ্লেষণের পরে আমাদের সার্ভারে সংরক্ষণ করা হয় না।
        </Text>

        <Text style={styles.disclaimer}>
          এই অ্যাপ ব্যবহার করে আপনি উপরোক্ত শর্তাবলী মেনে নিচ্ছেন।
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Bullet({ text }) {
  return (
    <View style={styles.bRow}>
      <Text style={styles.bDot}>✓</Text>
      <Text style={styles.bText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  h1: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16, marginBottom: 8 },
  p: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 8 },
  bRow: { flexDirection: 'row', marginBottom: 6, paddingLeft: 8 },
  bDot: { color: COLORS.forestGreen, marginRight: 8, fontWeight: '700' },
  bText: { flex: 1, fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  disclaimer: { marginTop: 16, fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
});
