import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setOnboarded, login, setLanguage } from './slices/authSlice';
import profileReducer, { setProfile, addFamilyMember, addChildProfile } from './slices/profileSlice';
import mealLogReducer from './slices/mealLogSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import { persistMiddleware, hydrateInitialState } from './persistence';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    mealLog: mealLogReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(persistMiddleware),
});

export async function rehydrate() {
  try {
    const data = await hydrateInitialState();
    if (data.auth) {
      if (data.auth.language) store.dispatch(setLanguage(data.auth.language));
      if (data.auth.isOnboarded) store.dispatch(setOnboarded(true));
      if (data.auth.isAuthenticated && data.auth.user) store.dispatch(login(data.auth.user));
    }
    if (data.profile?.profile) {
      store.dispatch(setProfile(data.profile.profile));
      for (const m of data.profile.familyMembers || []) store.dispatch(addFamilyMember(m));
      for (const c of data.profile.childProfiles || []) store.dispatch(addChildProfile(c));
    }
    if (data.meals?.meals) {
      // direct state replace via internal action — we just import the slice raw
      store.dispatch({ type: 'mealLog/replaceState', payload: data.meals });
    }
    if (data.chat?.messages) {
      store.dispatch({ type: 'chat/replaceState', payload: data.chat });
    }
  } catch (e) {
    console.warn('[rehydrate]', e);
  }
}

export default store;
