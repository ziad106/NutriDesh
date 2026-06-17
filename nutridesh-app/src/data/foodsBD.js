// Bangladeshi food database — values per 100g
// Sources: FAO Bangladesh FCT, BIRDEM dietary guidelines, USDA FoodData Central
export const FOODS_BD = [
  // === RICE & GRAINS ===
  { id: 'f001', name_bn: 'সাদা ভাত', name_en: 'White Rice (cooked)', category: 'rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, iron: 0.2, calcium: 10, vitA: 0, vitC: 0, folate: 3, sodium: 1, potassium: 35, gi: 73, giCat: 'high', isCooked: true, season: 'year-round', price: 4, emoji: '🍚' },
  { id: 'f002', name_bn: 'লাল চালের ভাত', name_en: 'Brown Rice', category: 'rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, iron: 0.4, calcium: 10, vitA: 0, vitC: 0, folate: 4, sodium: 5, potassium: 43, gi: 55, giCat: 'medium', isCooked: true, season: 'year-round', price: 6, emoji: '🍚' },
  { id: 'f003', name_bn: 'রুটি (আটার)', name_en: 'Roti (Whole Wheat)', category: 'rice', calories: 297, protein: 11, carbs: 56, fat: 4, fiber: 11, iron: 3, calcium: 31, vitA: 0, vitC: 0, folate: 15, sodium: 350, potassium: 240, gi: 62, giCat: 'medium', isCooked: true, season: 'year-round', price: 8, emoji: '🫓' },
  { id: 'f004', name_bn: 'পরোটা', name_en: 'Paratha', category: 'rice', calories: 320, protein: 6.4, carbs: 41, fat: 15, fiber: 4, iron: 2, calcium: 25, vitA: 0, vitC: 0, folate: 12, sodium: 420, potassium: 130, gi: 70, giCat: 'high', isCooked: true, season: 'year-round', price: 12, emoji: '🫓' },
  { id: 'f005', name_bn: 'খিচুড়ি', name_en: 'Khichuri', category: 'rice', calories: 165, protein: 6.5, carbs: 28, fat: 3.2, fiber: 2, iron: 1.5, calcium: 25, vitA: 35, vitC: 1, folate: 30, sodium: 250, potassium: 180, gi: 65, giCat: 'medium', isCooked: true, season: 'year-round', price: 7, emoji: '🍲' },

  // === DAL ===
  { id: 'f010', name_bn: 'মসুর ডাল', name_en: 'Masoor Dal', category: 'dal', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, iron: 3.3, calcium: 19, vitA: 0, vitC: 1.5, folate: 181, sodium: 2, potassium: 369, gi: 32, giCat: 'low', isCooked: true, season: 'year-round', price: 8, emoji: '🥣' },
  { id: 'f011', name_bn: 'মুগ ডাল', name_en: 'Moong Dal', category: 'dal', calories: 105, protein: 7, carbs: 19, fat: 0.4, fiber: 7.6, iron: 1.4, calcium: 27, vitA: 0, vitC: 1, folate: 159, sodium: 2, potassium: 266, gi: 31, giCat: 'low', isCooked: true, season: 'year-round', price: 9, emoji: '🥣' },
  { id: 'f012', name_bn: 'ছোলার ডাল', name_en: 'Chana Dal', category: 'dal', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, iron: 2.9, calcium: 49, vitA: 0, vitC: 1.3, folate: 172, sodium: 7, potassium: 291, gi: 28, giCat: 'low', isCooked: true, season: 'year-round', price: 10, emoji: '🥣' },
  { id: 'f013', name_bn: 'মাষকলাই ডাল', name_en: 'Maskalai Dal', category: 'dal', calories: 132, protein: 9, carbs: 22, fat: 0.5, fiber: 8, iron: 3.5, calcium: 65, vitA: 0, vitC: 0, folate: 132, sodium: 4, potassium: 380, gi: 30, giCat: 'low', isCooked: true, season: 'year-round', price: 10, emoji: '🥣' },

  // === FISH ===
  { id: 'f020', name_bn: 'ইলিশ মাছ', name_en: 'Hilsa (Ilish)', category: 'fish', calories: 273, protein: 21, carbs: 0, fat: 19, fiber: 0, iron: 2.1, calcium: 180, vitA: 30, vitC: 0, folate: 16, sodium: 64, potassium: 290, gi: 0, giCat: 'low', isCooked: true, season: 'monsoon', price: 80, emoji: '🐟' },
  { id: 'f021', name_bn: 'রুই মাছ', name_en: 'Rui (Rohu)', category: 'fish', calories: 97, protein: 16, carbs: 0, fat: 1.4, fiber: 0, iron: 1, calcium: 100, vitA: 25, vitC: 0, folate: 12, sodium: 80, potassium: 250, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 35, emoji: '🐟' },
  { id: 'f022', name_bn: 'কাতলা মাছ', name_en: 'Katla', category: 'fish', calories: 111, protein: 19, carbs: 0, fat: 2.4, fiber: 0, iron: 1.1, calcium: 110, vitA: 25, vitC: 0, folate: 11, sodium: 75, potassium: 260, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 30, emoji: '🐟' },
  { id: 'f023', name_bn: 'শোল মাছ', name_en: 'Shol Fish', category: 'fish', calories: 90, protein: 18, carbs: 0, fat: 1.7, fiber: 0, iron: 1.6, calcium: 120, vitA: 18, vitC: 0, folate: 9, sodium: 70, potassium: 280, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 50, emoji: '🐟' },
  { id: 'f024', name_bn: 'পাবদা মাছ', name_en: 'Pabda', category: 'fish', calories: 100, protein: 15, carbs: 0, fat: 4, fiber: 0, iron: 1.2, calcium: 250, vitA: 35, vitC: 0, folate: 10, sodium: 85, potassium: 240, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 70, emoji: '🐟' },
  { id: 'f025', name_bn: 'শুটকি মাছ', name_en: 'Shutki (Dried Fish)', category: 'fish', calories: 270, protein: 60, carbs: 0, fat: 4, fiber: 0, iron: 4, calcium: 1200, vitA: 0, vitC: 0, folate: 8, sodium: 1500, potassium: 450, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 60, emoji: '🐟' },
  { id: 'f026', name_bn: 'চিংড়ি', name_en: 'Chingri (Shrimp)', category: 'fish', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, iron: 0.5, calcium: 70, vitA: 60, vitC: 0, folate: 19, sodium: 111, potassium: 259, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 80, emoji: '🦐' },

  // === MEAT / EGGS ===
  { id: 'f030', name_bn: 'মুরগির মাংস', name_en: 'Chicken', category: 'meat', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, iron: 1, calcium: 15, vitA: 16, vitC: 0, folate: 4, sodium: 74, potassium: 256, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 40, emoji: '🍗' },
  { id: 'f031', name_bn: 'গরুর মাংস', name_en: 'Beef', category: 'meat', calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0, iron: 2.6, calcium: 18, vitA: 0, vitC: 0, folate: 7, sodium: 72, potassium: 318, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 75, emoji: '🥩' },
  { id: 'f032', name_bn: 'ডিম (মুরগি)', name_en: 'Egg', category: 'meat', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, iron: 1.2, calcium: 50, vitA: 140, vitC: 0, folate: 44, sodium: 124, potassium: 126, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 15, emoji: '🥚' },

  // === VEGETABLES ===
  { id: 'f040', name_bn: 'পুঁই শাক', name_en: 'Pui Shak (Malabar Spinach)', category: 'vegetable', calories: 19, protein: 1.8, carbs: 3.4, fat: 0.3, fiber: 2.1, iron: 1.2, calcium: 109, vitA: 800, vitC: 102, folate: 140, sodium: 24, potassium: 510, gi: 15, giCat: 'low', isCooked: false, season: 'monsoon', price: 4, emoji: '🥬' },
  { id: 'f041', name_bn: 'লাল শাক', name_en: 'Lal Shak (Red Amaranth)', category: 'vegetable', calories: 23, protein: 2.5, carbs: 4, fat: 0.3, fiber: 2.2, iron: 2.3, calcium: 215, vitA: 1000, vitC: 60, folate: 120, sodium: 20, potassium: 611, gi: 15, giCat: 'low', isCooked: false, season: 'winter', price: 4, emoji: '🥬' },
  { id: 'f042', name_bn: 'পালং শাক', name_en: 'Palong Shak (Spinach)', category: 'vegetable', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, iron: 2.7, calcium: 99, vitA: 469, vitC: 28, folate: 194, sodium: 79, potassium: 558, gi: 15, giCat: 'low', isCooked: false, season: 'winter', price: 5, emoji: '🥬' },
  { id: 'f043', name_bn: 'সজনে ডাঁটা', name_en: 'Sajne Data (Drumstick)', category: 'vegetable', calories: 37, protein: 2.1, carbs: 8.5, fat: 0.2, fiber: 3.2, iron: 0.4, calcium: 30, vitA: 74, vitC: 141, folate: 40, sodium: 42, potassium: 461, gi: 25, giCat: 'low', isCooked: false, season: 'summer', price: 8, emoji: '🥒' },
  { id: 'f044', name_bn: 'করলা', name_en: 'Karola (Bitter Gourd)', category: 'vegetable', calories: 17, protein: 1, carbs: 3.7, fat: 0.2, fiber: 2.8, iron: 0.4, calcium: 19, vitA: 24, vitC: 84, folate: 72, sodium: 5, potassium: 296, gi: 22, giCat: 'low', isCooked: false, season: 'summer', price: 6, emoji: '🥒' },
  { id: 'f045', name_bn: 'লাউ', name_en: 'Lau (Bottle Gourd)', category: 'vegetable', calories: 14, protein: 0.6, carbs: 3.4, fat: 0.02, fiber: 0.5, iron: 0.2, calcium: 26, vitA: 0, vitC: 10, folate: 6, sodium: 2, potassium: 150, gi: 15, giCat: 'low', isCooked: false, season: 'monsoon', price: 3, emoji: '🥒' },
  { id: 'f046', name_bn: 'বেগুন', name_en: 'Begun (Eggplant)', category: 'vegetable', calories: 25, protein: 1, carbs: 5.9, fat: 0.2, fiber: 3, iron: 0.2, calcium: 9, vitA: 2, vitC: 2.2, folate: 22, sodium: 2, potassium: 229, gi: 15, giCat: 'low', isCooked: false, season: 'year-round', price: 4, emoji: '🍆' },
  { id: 'f047', name_bn: 'আলু', name_en: 'Aloo (Potato)', category: 'vegetable', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, iron: 0.8, calcium: 12, vitA: 0, vitC: 19.7, folate: 15, sodium: 6, potassium: 425, gi: 78, giCat: 'high', isCooked: false, season: 'year-round', price: 3, emoji: '🥔' },
  { id: 'f048', name_bn: 'টমেটো', name_en: 'Tomato', category: 'vegetable', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, iron: 0.3, calcium: 10, vitA: 42, vitC: 13.7, folate: 15, sodium: 5, potassium: 237, gi: 15, giCat: 'low', isCooked: false, season: 'winter', price: 4, emoji: '🍅' },
  { id: 'f049', name_bn: 'গাজর', name_en: 'Gajor (Carrot)', category: 'vegetable', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, iron: 0.3, calcium: 33, vitA: 835, vitC: 5.9, folate: 19, sodium: 69, potassium: 320, gi: 39, giCat: 'low', isCooked: false, season: 'winter', price: 4, emoji: '🥕' },
  { id: 'f050', name_bn: 'ঢেঁড়স', name_en: 'Dheros (Okra)', category: 'vegetable', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2, iron: 0.6, calcium: 82, vitA: 36, vitC: 23, folate: 60, sodium: 7, potassium: 299, gi: 20, giCat: 'low', isCooked: false, season: 'summer', price: 5, emoji: '🌶️' },

  // === FRUITS ===
  { id: 'f060', name_bn: 'কলা', name_en: 'Banana', category: 'fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, iron: 0.3, calcium: 5, vitA: 3, vitC: 8.7, folate: 20, sodium: 1, potassium: 358, gi: 51, giCat: 'medium', isCooked: false, season: 'year-round', price: 3, emoji: '🍌' },
  { id: 'f061', name_bn: 'আম', name_en: 'Mango', category: 'fruit', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, iron: 0.2, calcium: 11, vitA: 54, vitC: 36.4, folate: 43, sodium: 1, potassium: 168, gi: 51, giCat: 'medium', isCooked: false, season: 'summer', price: 12, emoji: '🥭' },
  { id: 'f062', name_bn: 'পেঁপে', name_en: 'Papaya', category: 'fruit', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, iron: 0.3, calcium: 20, vitA: 47, vitC: 60.9, folate: 37, sodium: 8, potassium: 182, gi: 60, giCat: 'medium', isCooked: false, season: 'year-round', price: 4, emoji: '🥭' },
  { id: 'f063', name_bn: 'পেয়ারা', name_en: 'Guava', category: 'fruit', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, iron: 0.3, calcium: 18, vitA: 31, vitC: 228, folate: 49, sodium: 2, potassium: 417, gi: 24, giCat: 'low', isCooked: false, season: 'winter', price: 5, emoji: '🍐' },
  { id: 'f064', name_bn: 'কাঁঠাল', name_en: 'Kathal (Jackfruit)', category: 'fruit', calories: 95, protein: 1.7, carbs: 23, fat: 0.6, fiber: 1.5, iron: 0.2, calcium: 34, vitA: 5, vitC: 13.8, folate: 24, sodium: 3, potassium: 303, gi: 50, giCat: 'medium', isCooked: false, season: 'summer', price: 6, emoji: '🥭' },
  { id: 'f065', name_bn: 'লেবু', name_en: 'Lebu (Lemon)', category: 'fruit', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, iron: 0.6, calcium: 26, vitA: 1, vitC: 53, folate: 11, sodium: 2, potassium: 138, gi: 20, giCat: 'low', isCooked: false, season: 'year-round', price: 4, emoji: '🍋' },

  // === SNACKS / STREET ===
  { id: 'f070', name_bn: 'সিঙ্গাড়া', name_en: 'Shingara', category: 'snack', calories: 308, protein: 5, carbs: 28, fat: 19, fiber: 3.5, iron: 1.6, calcium: 21, vitA: 5, vitC: 4, folate: 25, sodium: 425, potassium: 215, gi: 65, giCat: 'medium', isCooked: true, season: 'year-round', price: 10, emoji: '🥟' },
  { id: 'f071', name_bn: 'পিয়াজু', name_en: 'Piyaju', category: 'snack', calories: 290, protein: 8, carbs: 30, fat: 15, fiber: 4, iron: 2, calcium: 30, vitA: 5, vitC: 4, folate: 30, sodium: 400, potassium: 200, gi: 55, giCat: 'medium', isCooked: true, season: 'year-round', price: 8, emoji: '🧅' },
  { id: 'f072', name_bn: 'মুড়ি', name_en: 'Muri (Puffed Rice)', category: 'snack', calories: 402, protein: 6, carbs: 90, fat: 0.7, fiber: 1, iron: 4, calcium: 14, vitA: 0, vitC: 0, folate: 4, sodium: 10, potassium: 90, gi: 87, giCat: 'high', isCooked: true, season: 'year-round', price: 12, emoji: '🍿' },
  { id: 'f073', name_bn: 'চা (দুধ)', name_en: 'Milk Tea', category: 'snack', calories: 65, protein: 2, carbs: 10, fat: 2, fiber: 0, iron: 0.1, calcium: 65, vitA: 25, vitC: 0, folate: 2, sodium: 30, potassium: 100, gi: 60, giCat: 'medium', isCooked: true, season: 'year-round', price: 10, emoji: '🍵' },

  // === DAIRY ===
  { id: 'f080', name_bn: 'দুধ', name_en: 'Milk', category: 'dairy', calories: 60, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, iron: 0.03, calcium: 113, vitA: 46, vitC: 0, folate: 5, sodium: 43, potassium: 132, gi: 31, giCat: 'low', isCooked: false, season: 'year-round', price: 8, emoji: '🥛' },
  { id: 'f081', name_bn: 'দই', name_en: 'Doi (Yogurt)', category: 'dairy', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, iron: 0.05, calcium: 121, vitA: 27, vitC: 0.5, folate: 7, sodium: 46, potassium: 155, gi: 35, giCat: 'low', isCooked: false, season: 'year-round', price: 10, emoji: '🥛' },

  // === COMBO DISHES ===
  { id: 'f090', name_bn: 'বিরিয়ানি', name_en: 'Biriyani', category: 'rice', calories: 280, protein: 12, carbs: 35, fat: 10, fiber: 1.5, iron: 1.8, calcium: 35, vitA: 30, vitC: 3, folate: 25, sodium: 600, potassium: 250, gi: 70, giCat: 'high', isCooked: true, season: 'year-round', price: 25, emoji: '🍛' },
  { id: 'f091', name_bn: 'মাছ ভাজি', name_en: 'Fried Fish', category: 'fish', calories: 200, protein: 22, carbs: 4, fat: 11, fiber: 0, iron: 1.5, calcium: 130, vitA: 25, vitC: 0, folate: 12, sodium: 250, potassium: 290, gi: 0, giCat: 'low', isCooked: true, season: 'year-round', price: 40, emoji: '🐟' },
  { id: 'f092', name_bn: 'ভর্তা (আলু)', name_en: 'Aloo Bhorta', category: 'vegetable', calories: 110, protein: 2, carbs: 18, fat: 4, fiber: 2.5, iron: 0.9, calcium: 15, vitA: 5, vitC: 18, folate: 18, sodium: 320, potassium: 430, gi: 75, giCat: 'high', isCooked: true, season: 'year-round', price: 6, emoji: '🥔' },
];

export function findFood(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return FOODS_BD.filter(
    (f) => f.name_bn.includes(query) || f.name_en.toLowerCase().includes(q)
  );
}

export function getFoodById(id) {
  return FOODS_BD.find((f) => f.id === id);
}

export function getSeasonalFoods(season) {
  return FOODS_BD.filter(
    (f) => f.season === season || f.season === 'year-round'
  ).slice(0, 8);
}

export default FOODS_BD;
