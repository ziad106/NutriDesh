import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImageManipulator from 'expo-image-manipulator';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import LottieLoader from '../../components/common/LottieLoader';
import { scanFood } from '../../services/api';

const MEAL_TYPES = [
  { key: 'breakfast', label: 'সকাল' },
  { key: 'lunch', label: 'দুপুর' },
  { key: 'dinner', label: 'রাত' },
  { key: 'snack', label: 'স্ন্যাক' },
];

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [scanning, setScanning] = useState(false);
  const [mealType, setMealType] = useState('lunch');
  const camRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  async function snap() {
    if (scanning) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setScanning(true);
    try {
      let base64 = '';
      let mime = 'image/jpeg';
      if (camRef.current?.takePictureAsync) {
        const photo = await camRef.current.takePictureAsync({ quality: 0.6, base64: false });
        const compressed = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        base64 = compressed.base64;
      } else {
        base64 = 'iVBORw0KGgo='; // dummy — backend mock will respond
      }
      const res = await scanFood(base64, mime, {});
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      navigation.navigate('ScanResult', { result: res, mealType });
    } catch (e) {
      Alert.alert('স্ক্যান ব্যর্থ', String(e?.message || e));
    } finally {
      setScanning(false);
    }
  }

  function pickFromGallery() {
    snap();
  }

  if (!permission) {
    return <View style={styles.box} />;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.box}>
        <View style={styles.permWrap}>
          <Text style={styles.permTitle}>ক্যামেরা অনুমতি দরকার</Text>
          <Text style={styles.permSub}>খাবার স্ক্যান করতে ক্যামেরা ব্যবহারের অনুমতি দিন।</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>অনুমতি দিন</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.demoBtn} onPress={snap}>
            <Text style={styles.demoBtnText}>ডেমো মোডে চলান (ক্যামেরা ছাড়া)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.box}>
      <CameraView
        ref={camRef}
        style={styles.cam}
        facing="back"
        enableTorch={flash === 'on'}
      />
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Text style={styles.iconText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>খাবার স্ক্যান</Text>
          <TouchableOpacity onPress={() => setFlash(flash === 'on' ? 'off' : 'on')} style={styles.iconBtn}>
            <Text style={styles.iconText}>{flash === 'on' ? '🔦' : '⚡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealRow}>
          {MEAL_TYPES.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMealType(m.key)}
              style={[styles.mealPill, mealType === m.key && styles.mealPillActive]}
            >
              <Text style={[styles.mealText, mealType === m.key && { color: '#fff', fontWeight: '700' }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.guideWrap}>
          <View style={styles.guide}>
            <View style={[styles.corner, styles.cTL]} />
            <View style={[styles.corner, styles.cTR]} />
            <View style={[styles.corner, styles.cBL]} />
            <View style={[styles.corner, styles.cBR]} />
            <Text style={styles.guideText}>{STRINGS.SCAN_PROMPT}</Text>
          </View>
        </View>

        {scanning && (
          <View style={styles.scanning}>
            <LottieLoader label={STRINGS.ANALYZING} />
          </View>
        )}

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={pickFromGallery} style={styles.sideBtn}>
            <Text style={styles.sideIcon}>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={snap} style={styles.shutter} disabled={scanning}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FoodSearch')} style={styles.sideBtn}>
            <Text style={styles.sideIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#000' },
  cam: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iconBtn: { padding: 8 },
  iconText: { color: '#fff', fontSize: 22 },
  title: { color: '#fff', fontSize: 17, fontWeight: '600' },
  mealRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 6, marginTop: 4 },
  mealPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginHorizontal: 4,
  },
  mealPillActive: { backgroundColor: COLORS.forestGreen },
  mealText: { color: '#fff', fontSize: 13 },
  guideWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  guide: { width: 260, height: 260, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: COLORS.lightGreen },
  cTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  cTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  cBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  cBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  guideText: { color: '#fff', fontSize: 16, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 8 },
  scanning: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 24,
    borderRadius: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sideBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  sideIcon: { fontSize: 24 },
  shutter: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.forestGreen },
  permWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: COLORS.warmCream },
  permTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  permSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  permBtn: { backgroundColor: COLORS.forestGreen, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  permBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  demoBtn: { marginTop: 16, padding: 12 },
  demoBtnText: { color: COLORS.forestGreen, fontSize: 14, fontWeight: '600' },
});
