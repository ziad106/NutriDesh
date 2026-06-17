import { createSlice } from '@reduxjs/toolkit';
import { calcCalorieTarget, calcMacroTargets, defaultMicroTargets } from '../../utils/nutritionCalculator';

const defaultProfile = {
  name: 'বন্ধু',
  age: 28,
  gender: 'male',
  weight_kg: 65,
  height_cm: 170,
  activity_level: 'light',
  goal: 'maintain',
  conditions: [],
  dietary_restrictions: [],
  health_goal_mode: 'none',
};

function withTargets(profile) {
  const cal = calcCalorieTarget(profile);
  const macros = calcMacroTargets(cal, profile);
  const micros = defaultMicroTargets(profile);
  return {
    ...profile,
    calorie_target: cal,
    protein_target_g: macros.protein,
    carbs_target_g: macros.carbs,
    fat_target_g: macros.fat,
    iron_target_mg: micros.iron,
    calcium_target_mg: micros.calcium,
    vitA_target_mcg: micros.vitA,
    folate_target_mcg: micros.folate,
    vitC_target_mg: micros.vitC,
    sodium_cap_mg: micros.sodium,
  };
}

const initialState = {
  profile: withTargets(defaultProfile),
  familyMembers: [],
  childProfiles: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = withTargets({ ...state.profile, ...action.payload });
    },
    updateProfile(state, action) {
      state.profile = withTargets({ ...state.profile, ...action.payload });
    },
    toggleCondition(state, action) {
      const cond = action.payload;
      const has = state.profile.conditions.includes(cond);
      state.profile.conditions = has
        ? state.profile.conditions.filter((c) => c !== cond)
        : [...state.profile.conditions, cond];
      state.profile = withTargets(state.profile);
    },
    setHealthMode(state, action) {
      state.profile.health_goal_mode = action.payload;
    },
    addFamilyMember(state, action) {
      state.familyMembers.push({ id: Date.now().toString(), ...action.payload });
    },
    removeFamilyMember(state, action) {
      state.familyMembers = state.familyMembers.filter((m) => m.id !== action.payload);
    },
    addChildProfile(state, action) {
      state.childProfiles.push({ id: Date.now().toString(), ...action.payload });
    },
  },
});

export const {
  setProfile,
  updateProfile,
  toggleCondition,
  setHealthMode,
  addFamilyMember,
  removeFamilyMember,
  addChildProfile,
} = profileSlice.actions;
export default profileSlice.reducer;
