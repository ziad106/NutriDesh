import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOffline: false,
  themeMode: 'light',
  rateLimitCountdown: 0,
  toastMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOffline(state, action) { state.isOffline = action.payload; },
    setThemeMode(state, action) { state.themeMode = action.payload; },
    setRateLimit(state, action) { state.rateLimitCountdown = action.payload; },
    setToast(state, action) { state.toastMessage = action.payload; },
  },
});

export const { setOffline, setThemeMode, setRateLimit, setToast } = uiSlice.actions;
export default uiSlice.reducer;
