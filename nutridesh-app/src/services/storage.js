import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: '@nutridesh/profile',
  MEALS: '@nutridesh/meals',
  CHAT: '@nutridesh/chat',
  GLUCOSE: '@nutridesh/glucose',
  MOOD: '@nutridesh/mood',
  ONBOARDED: '@nutridesh/onboarded',
  SETTINGS: '@nutridesh/settings',
};

export const STORAGE_KEYS = KEYS;

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export default { loadJSON, saveJSON, clearAll, STORAGE_KEYS: KEYS };
