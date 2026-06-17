import { createSlice } from '@reduxjs/toolkit';
import { MOCK_MEALS } from '../../data/mockMeals';

const initialState = {
  meals: MOCK_MEALS,
  glucoseLogs: [],
  moodLogs: [],
  streak: 7,
};

const mealLogSlice = createSlice({
  name: 'mealLog',
  initialState,
  reducers: {
    addMeal(state, action) {
      state.meals.unshift({
        id: 'm' + Date.now(),
        logged_at: Date.now(),
        ...action.payload,
      });
    },
    addMeals(state, action) {
      const ts = Date.now();
      const items = action.payload.map((m, i) => ({
        id: 'm' + (ts + i),
        logged_at: ts,
        ...m,
      }));
      state.meals.unshift(...items);
    },
    removeMeal(state, action) {
      state.meals = state.meals.filter((m) => m.id !== action.payload);
    },
    addGlucose(state, action) {
      state.glucoseLogs.unshift({
        id: 'g' + Date.now(),
        logged_at: Date.now(),
        ...action.payload,
      });
    },
    addMood(state, action) {
      state.moodLogs.unshift({
        id: 'mo' + Date.now(),
        logged_at: Date.now(),
        ...action.payload,
      });
    },
    incrementStreak(state) {
      state.streak += 1;
    },
    replaceState(state, action) {
      Object.assign(state, action.payload || {});
    },
  },
});

export const { addMeal, addMeals, removeMeal, addGlucose, addMood, incrementStreak } = mealLogSlice.actions;
export default mealLogSlice.reducer;
