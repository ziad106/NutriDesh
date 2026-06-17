import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isOnboarded: false,
  user: null,
  language: 'bn', // 'bn' | 'en'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnboarded(state, action) {
      state.isOnboarded = action.payload !== false;
    },
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload || { phone: '01700000000', name: 'বন্ধু' };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
});

export const { setOnboarded, login, logout, setLanguage } = authSlice.actions;
export default authSlice.reducer;
