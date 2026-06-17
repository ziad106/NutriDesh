// Lightweight Redux persistence middleware. Saves selected slices to AsyncStorage on each action.
import { loadJSON, saveJSON, STORAGE_KEYS } from '../services/storage';

const SAVE_DEBOUNCE = 400;
let timers = {};

function debounce(key, fn) {
  clearTimeout(timers[key]);
  timers[key] = setTimeout(fn, SAVE_DEBOUNCE);
}

export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  if (action.type.startsWith('auth/')) {
    debounce('auth', () => saveJSON(STORAGE_KEYS.SETTINGS, {
      isOnboarded: state.auth.isOnboarded,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user,
      language: state.auth.language,
    }));
  }
  if (action.type.startsWith('profile/')) {
    debounce('profile', () => saveJSON(STORAGE_KEYS.PROFILE, {
      profile: state.profile.profile,
      familyMembers: state.profile.familyMembers,
      childProfiles: state.profile.childProfiles,
    }));
  }
  if (action.type.startsWith('mealLog/')) {
    debounce('meals', () => saveJSON(STORAGE_KEYS.MEALS, {
      meals: state.mealLog.meals,
      glucoseLogs: state.mealLog.glucoseLogs,
      moodLogs: state.mealLog.moodLogs,
      streak: state.mealLog.streak,
    }));
  }
  if (action.type.startsWith('chat/')) {
    debounce('chat', () => saveJSON(STORAGE_KEYS.CHAT, {
      messages: state.chat.messages.slice(0, 50),
    }));
  }
  return result;
};

export async function hydrateInitialState() {
  const [auth, profile, meals, chat] = await Promise.all([
    loadJSON(STORAGE_KEYS.SETTINGS, null),
    loadJSON(STORAGE_KEYS.PROFILE, null),
    loadJSON(STORAGE_KEYS.MEALS, null),
    loadJSON(STORAGE_KEYS.CHAT, null),
  ]);
  return { auth, profile, meals, chat };
}
