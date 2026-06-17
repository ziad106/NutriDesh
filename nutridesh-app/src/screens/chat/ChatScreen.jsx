import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import { addMessage, setTyping } from '../../store/slices/chatSlice';
import { chat as apiChat } from '../../services/api';

const QUICK_REPLIES = [
  STRINGS.QUICK_REPLY_1,
  STRINGS.QUICK_REPLY_2,
  STRINGS.QUICK_REPLY_3,
  STRINGS.QUICK_REPLY_4,
  STRINGS.QUICK_REPLY_5,
];

function TypingDots() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    setTimeout(() => { dot2.value = withRepeat(withTiming(1, { duration: 600 }), -1, true); }, 200);
    setTimeout(() => { dot3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true); }, 400);
  }, []);
  const s1 = useAnimatedStyle(() => ({ opacity: 0.3 + dot1.value * 0.7, transform: [{ translateY: -3 * dot1.value }] }));
  const s2 = useAnimatedStyle(() => ({ opacity: 0.3 + dot2.value * 0.7, transform: [{ translateY: -3 * dot2.value }] }));
  const s3 = useAnimatedStyle(() => ({ opacity: 0.3 + dot3.value * 0.7, transform: [{ translateY: -3 * dot3.value }] }));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
      <Animated.Text style={[styles.dot, s1]}>●</Animated.Text>
      <Animated.Text style={[styles.dot, s2]}>●</Animated.Text>
      <Animated.Text style={[styles.dot, s3]}>●</Animated.Text>
    </View>
  );
}

export default function ChatScreen() {
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.chat.messages);
  const isTyping = useSelector((s) => s.chat.isTyping);
  const profile = useSelector((s) => s.profile.profile);
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  async function send(content) {
    const msg = (content || text).trim();
    if (!msg) return;
    setText('');
    dispatch(addMessage({ _id: 'u' + Date.now(), text: msg, createdAt: new Date(), user: { _id: 1 } }));
    dispatch(setTyping(true));
    const reply = await apiChat(msg, profile, {}, messages.slice(0, 10).map(m => ({ role: m.user?._id === 1 ? 'user' : 'model', content: m.text })));
    dispatch(setTyping(false));
    dispatch(addMessage({ _id: 'a' + Date.now(), text: reply, createdAt: new Date(), user: { _id: 2, name: STRINGS.ASSISTANT_NAME } }));
  }

  function speak(t) {
    Speech.stop();
    Speech.speak(t, { language: 'bn-BD', rate: 0.95 });
  }

  return (
    <SafeAreaView style={styles.box} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🌿</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{STRINGS.ASSISTANT_NAME}</Text>
          <View style={styles.statusRow}>
            <View style={styles.dotOnline} />
            <Text style={styles.statusText}>অনলাইন</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {[...messages].reverse().map((m) => {
          const isUser = m.user?._id === 1;
          return (
            <View key={m._id} style={[styles.bubbleRow, isUser ? styles.userRow : styles.aiRow]}>
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, isUser && { color: '#fff' }]}>{m.text}</Text>
                {!isUser && (
                  <TouchableOpacity onPress={() => speak(m.text)} style={styles.speakBtn}>
                    <Text style={styles.speakIcon}>🔊</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        {isTyping && (
          <View style={[styles.bubbleRow, styles.aiRow]}>
            <View style={[styles.bubble, styles.bubbleAI, { flexDirection: 'row', alignItems: 'center' }]}>
              <Text style={styles.bubbleText}>{STRINGS.CHAT_THINKING}</Text>
              <TypingDots />
            </View>
          </View>
        )}
      </ScrollView>

      {messages.length <= 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickWrap} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {QUICK_REPLIES.map((q, i) => (
            <TouchableOpacity key={i} style={styles.quickChip} onPress={() => send(q)}>
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={STRINGS.CHAT_PLACEHOLDER}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send()}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: COLORS.warmCream },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { fontSize: 32, marginRight: 10 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dotOnline: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.forestGreen, marginRight: 6 },
  statusText: { fontSize: 12, color: COLORS.textSecondary },
  scroll: { flex: 1 },
  bubbleRow: { marginVertical: 4, flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  bubbleUser: { backgroundColor: COLORS.forestGreen, borderTopRightRadius: 4 },
  bubbleAI: { backgroundColor: COLORS.cardSurface, borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#E0DDD5' },
  bubbleText: { fontSize: 15, lineHeight: 22, color: COLORS.textPrimary },
  speakBtn: { marginTop: 6 },
  speakIcon: { fontSize: 16 },
  dot: { fontSize: 14, color: COLORS.textSecondary, marginHorizontal: 1 },
  quickWrap: { maxHeight: 60, marginBottom: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.cardSurface, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.forestGreen },
  quickText: { fontSize: 13, color: COLORS.forestGreen },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.warmCream },
  input: { flex: 1, backgroundColor: COLORS.cardSurface, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.forestGreen, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
