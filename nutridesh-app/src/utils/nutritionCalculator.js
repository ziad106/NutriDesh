// Compute nutrition totals from meal list. Each meal: { food, portion_g }
export function totalsFromMeals(meals = []) {
  const total = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    iron: 0,
    calcium: 0,
    vitA: 0,
    vitC: 0,
    folate: 0,
    sodium: 0,
    potassium: 0,
  };
  for (const m of meals) {
    if (!m.food) continue;
    const factor = (m.portion_g || 100) / 100;
    for (const k of Object.keys(total)) {
      total[k] += (m.food[k] || 0) * factor;
    }
  }
  for (const k of Object.keys(total)) {
    total[k] = Math.round(total[k] * 10) / 10;
  }
  return total;
}

// Mifflin-St Jeor BMR + activity factor
export function calcCalorieTarget(profile) {
  const { age = 30, gender = 'male', weight_kg = 65, height_cm = 165, activity_level = 'light', goal = 'maintain' } = profile || {};
  const bmr =
    gender === 'female'
      ? 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
      : 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  const activityMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  let tdee = bmr * (activityMap[activity_level] || 1.375);
  if (goal === 'lose') tdee -= 500;
  if (goal === 'gain') tdee += 300;
  return Math.round(tdee);
}

export function calcMacroTargets(calorieTarget, profile) {
  // Default 20% protein, 50% carbs, 30% fat (Bangladesh diet realistic)
  const protein = Math.round((calorieTarget * 0.2) / 4);
  const carbs = Math.round((calorieTarget * 0.5) / 4);
  const fat = Math.round((calorieTarget * 0.3) / 9);
  return { protein, carbs, fat };
}

export function defaultMicroTargets(profile) {
  const isFemale = profile?.gender === 'female';
  const isPregnant = profile?.conditions?.includes('pregnancy');
  return {
    iron: isPregnant ? 27 : isFemale ? 18 : 8,        // mg
    calcium: 1000,                                      // mg
    vitA: 800,                                          // mcg RAE
    folate: isPregnant ? 600 : 400,                     // mcg
    vitC: 90,                                           // mg
    sodium: 2300,                                       // mg cap
  };
}

export function percentOf(actual, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((actual / target) * 100));
}

export function getMealsForDay(meals, date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return meals.filter((m) => {
    const ts = typeof m.logged_at === 'number' ? m.logged_at : new Date(m.logged_at).getTime();
    return ts >= start.getTime() && ts < end.getTime();
  });
}

export function getMealsForLastDays(meals, days = 7) {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return meals.filter((m) => {
    const ts = typeof m.logged_at === 'number' ? m.logged_at : new Date(m.logged_at).getTime();
    return ts >= cutoff;
  });
}

export function greetingForHour(hour) {
  if (hour < 12) return 'সুপ্রভাত';
  if (hour < 17) return 'শুভ দুপুর';
  return 'শুভ সন্ধ্যা';
}
