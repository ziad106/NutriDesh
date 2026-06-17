// Mock AI service. Replace with Gemini API call when key is set in EXPO_PUBLIC_GEMINI_KEY.
import { FOODS_BD, findFood } from '../data/foodsBD';

function pickRandom(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Simulate Gemini food scan — picks plausible BD foods
export async function mockScanFood() {
  await delay(1500 + Math.random() * 800);
  const plates = [
    ['f001', 'f010', 'f021'], // bhat + dal + rui
    ['f001', 'f020', 'f042'], // bhat + ilish + palong
    ['f003', 'f032'],         // ruti + dim
    ['f090'],                  // biriyani
    ['f001', 'f011', 'f041'], // bhat + moong + lal shak
    ['f047', 'f032', 'f003'], // aloo + dim + ruti
  ];
  const chosen = plates[Math.floor(Math.random() * plates.length)];
  const items = chosen.map((id) => {
    const f = FOODS_BD.find((x) => x.id === id);
    return {
      food_id: f.id,
      food_name_bn: f.name_bn,
      food_name_en: f.name_en,
      estimated_quantity_g: 80 + Math.round(Math.random() * 120),
      confidence: Math.random() > 0.3 ? 'high' : 'medium',
      is_cooked: f.isCooked,
      category: f.category,
      emoji: f.emoji,
    };
  });
  return {
    items,
    plate_description_bn: items.map((i) => i.food_name_bn).join(' + '),
  };
}

const CHAT_RESPONSES = {
  diabetes: 'ডায়াবেটিসে বিরিয়ানি কম খাওয়া ভালো — উচ্চ GI। তবে অল্প পরিমাণে (১০০গ্রাম) ও সাথে শাক-সবজি/দই থাকলে গ্লুকোজ স্পাইক কম হবে। ইলিশ মাছ নিরাপদ — কম GI, ওমেগা-৩ ভালো।',
  protein: 'প্রোটিন কম হলে দিনে ১টি ডিম, ১ বাটি ডাল (৫০গ্রাম) ও ১০০গ্রাম মাছ/মুরগি যোগ করুন। দুধ-দই সকালের নাস্তায় যোগ করলে আরো ভালো হবে।',
  budget: '১৫০ টাকায় ৩টি পুষ্টিকর মিল:\n১. ডিম ভাজি + রুটি (৩৫টাকা)\n২. মসুর ডাল + ভাত + আলু ভর্তা (৪০টাকা)\n৩. ছোট মাছ + শাক + ভাত (৭৫টাকা)\nমোট প্রোটিন ~৪৫গ্রাম।',
  ramadan: 'সেহরিতে: ওটস/ডাল-ভাত, ১টি ডিম, কলা — ধীর শক্তি দিবে।\nইফতার: ২টি খেজুর + পানি, ছোলা ভিজানো, ফল, লেবুর শরবত। ভাজা-পোড়া কম খান।',
  child: 'শিশুর জন্য:\n- খিচুড়ি (ডাল+ভাত+সবজি) — পূর্ণ প্রোটিন\n- ডিমের কুসুম দৈনিক\n- কলা/পেঁপে — ভিটামিন A\n- দুধ ২ কাপ। চিনি/কোমল পানীয় এড়ান।',
  iron: 'আয়রন বাড়াতে: লাল শাক, পুঁই শাক, কলিজা, ছোট মাছ। ভিটামিন C (লেবু/পেয়ারা) সাথে খেলে শোষণ বাড়ে। চা/কফি খাবারের সাথে এড়িয়ে চলুন।',
  ilish: 'ইলিশ মাছ ডায়াবেটিকদের জন্য নিরাপদ — কম GI (০), ওমেগা-৩ ফ্যাটি অ্যাসিড আছে যা ইনসুলিন সংবেদনশীলতা বাড়ায়। সরিষা তেলে ভাজার বদলে ভাপে রান্না করুন।',
  default: 'আমি আপনার পুষ্টি সহায়ক। খাবার, ক্যালরি, পুষ্টি বা স্বাস্থ্য নিয়ে প্রশ্ন করুন। যেমন: "আজ কী খাব?", "ডায়াবেটিসে কী এড়ানো উচিত?", "প্রোটিন বাড়াতে কী খাব?"',
};

function matchResponse(msg) {
  const m = msg.toLowerCase();
  if (/(ডায়াবেট|diabet|বিরিয়ান|biriyan|sugar|চিনি)/i.test(msg)) return CHAT_RESPONSES.diabetes;
  if (/(ইলিশ|ilish|hilsa)/i.test(msg)) return CHAT_RESPONSES.ilish;
  if (/(protein|প্রোটিন)/i.test(msg)) return CHAT_RESPONSES.protein;
  if (/(বাজেট|budget|টাকা|৳|tk|taka)/i.test(msg)) return CHAT_RESPONSES.budget;
  if (/(রমজান|ramadan|সেহরি|ইফতার|sehri|iftar|fast)/i.test(msg)) return CHAT_RESPONSES.ramadan;
  if (/(শিশু|child|বাচ্চা|baby)/i.test(msg)) return CHAT_RESPONSES.child;
  if (/(iron|আয়রন|রক্তশূন্য|anaemi)/i.test(msg)) return CHAT_RESPONSES.iron;
  return CHAT_RESPONSES.default;
}

export async function mockChat(userMessage /* , profile, todayLog, history */) {
  await delay(900 + Math.random() * 700);
  return matchResponse(userMessage);
}

export async function mockRecommendations(profile, todayLog, budget = null) {
  await delay(1000);
  const safe = FOODS_BD.filter((f) => f.giCat !== 'high' && f.protein >= 5);
  const picks = pickRandom(safe, 3);
  return {
    recommendations: picks.map((f) => ({
      meal_name_bn: f.name_bn,
      reason_bn: `প্রোটিন ${f.protein}গ্রাম, কম GI — সুস্থ পছন্দ`,
      estimated_calories: Math.round(f.calories * 1.5),
      key_nutrients: ['প্রোটিন', f.iron >= 1 ? 'আয়রন' : 'ক্যালসিয়াম'],
      estimated_cost_bdt: Math.round(f.price * 1.5),
      is_diabetic_safe: f.giCat === 'low',
      emoji: f.emoji,
    })),
  };
}

export async function mockPredictDeficiencies(profile, last7DaysLogs) {
  await delay(800);
  // Simple rule: if total iron < target * 7 * 0.6, flag
  const preds = [];
  preds.push({
    nutrient: 'আয়রন',
    risk_level: 'medium',
    days_until_deficiency: 7,
    message_bn: 'গত ৩ দিনে আয়রন গ্রহণ কম — শাক-সবজি বাড়ান।',
    suggested_foods_bn: ['লাল শাক', 'পুঁই শাক', 'কলিজা', 'মসুর ডাল'],
  });
  return { predictions: preds };
}

export async function mockWhatCanICook(ingredients = []) {
  await delay(900);
  return {
    recipes: [
      {
        name_bn: 'মসুর ডাল-ভাত',
        cooking_time_min: 25,
        nutrition_score: 9,
        is_diabetic_safe: true,
        instructions_bn: 'ডাল ধুয়ে সিদ্ধ করুন, হলুদ-লবণ-পেঁয়াজ দিয়ে ফোড়ন। ভাত আলাদা সিদ্ধ। গরম পরিবেশন।',
        estimated_calories: 320,
      },
      {
        name_bn: 'শাক ভাজি + রুটি',
        cooking_time_min: 15,
        nutrition_score: 8,
        is_diabetic_safe: true,
        instructions_bn: 'শাক ভালো করে ধুয়ে নিন। তেলে পেঁয়াজ-রসুন ফোড়ন, শাক দিয়ে নাড়ুন ৫ মিনিট। রুটি সাথে।',
        estimated_calories: 250,
      },
      {
        name_bn: 'ডিম তরকারি',
        cooking_time_min: 20,
        nutrition_score: 8,
        is_diabetic_safe: true,
        instructions_bn: 'ডিম সিদ্ধ করে খোসা ছাড়ান। মসলা কষিয়ে ডিম দিন, ১০ মিনিট ফুটান।',
        estimated_calories: 280,
      },
    ],
  };
}

export default {
  mockScanFood,
  mockChat,
  mockRecommendations,
  mockPredictDeficiencies,
  mockWhatCanICook,
};
