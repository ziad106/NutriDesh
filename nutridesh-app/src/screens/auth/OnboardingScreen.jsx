import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';

const { width } = Dimensions.get('window');

const PAGES = [
  { emoji: '🍚', title: STRINGS.ONB1_TITLE, sub: STRINGS.ONB1_SUB, bg: '#FFF4E0' },
  { emoji: '🌿', title: STRINGS.ONB2_TITLE, sub: STRINGS.ONB2_SUB, bg: '#E8F5E9' },
  { emoji: '💚', title: STRINGS.ONB3_TITLE, sub: STRINGS.ONB3_SUB, bg: '#FCE9DE' },
];

export default function OnboardingScreen({ navigation }) {
  const [page, setPage] = useState(0);
  const ref = useRef(null);

  function next() {
    if (page < PAGES.length - 1) {
      ref.current.scrollToIndex({ index: page + 1 });
    } else {
      navigation.replace('ProfileWizard');
    }
  }
  function skip() {
    navigation.replace('ProfileWizard');
  }

  return (
    <View style={styles.box}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={skip}>
          <Text style={styles.skip}>{STRINGS.SKIP}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={ref}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => 'p' + i}
        onMomentumScrollEnd={(e) => {
          setPage(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width, backgroundColor: item.bg }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.sub}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {PAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>
      <TouchableOpacity style={styles.cta} onPress={next}>
        <Text style={styles.ctaText}>
          {page === PAGES.length - 1 ? STRINGS.GET_STARTED : STRINGS.NEXT}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, paddingTop: 48 },
  skip: { fontSize: 16, color: COLORS.textSecondary },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 96, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16, textAlign: 'center' },
  sub: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border, marginHorizontal: 4 },
  dotActive: { backgroundColor: COLORS.forestGreen, width: 24 },
  cta: {
    backgroundColor: COLORS.forestGreen,
    marginHorizontal: 24,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
