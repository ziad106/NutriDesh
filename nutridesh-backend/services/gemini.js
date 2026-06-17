// Gemini service — falls back to mock if GEMINI_API_KEY not set or SDK missing
let genAI = null;
const keyPresent = !!process.env.GEMINI_API_KEY;

if (keyPresent) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('[gemini] SDK loaded — LIVE mode');
  } catch (e) {
    console.warn('[gemini] @google/generative-ai not installed — running MOCK. Run `npm install @google/generative-ai`');
    genAI = null;
  }
} else {
  console.log('[gemini] No GEMINI_API_KEY — running MOCK');
}

// Reflects actual capability, not just env var presence
const hasKey = !!genAI;

const MOCK_FOODS = [
  { food_name_bn: 'সাদা ভাত', food_name_en: 'White Rice', estimated_quantity_g: 150, confidence: 'high', is_cooked: true, category: 'rice' },
  { food_name_bn: 'মসুর ডাল', food_name_en: 'Masoor Dal', estimated_quantity_g: 100, confidence: 'high', is_cooked: true, category: 'dal' },
  { food_name_bn: 'রুই মাছ', food_name_en: 'Rui Fish', estimated_quantity_g: 120, confidence: 'medium', is_cooked: true, category: 'fish' },
];

function buildSystemPrompt(profile = {}, todayLog = {}) {
  return `তুমি NutriDesh-এর পুষ্টি সহায়ক — একজন বিশ্বস্ত বাংলাদেশি পুষ্টিবিদ।

নিয়ম:
- সবসময় বাংলায় উত্তর দাও
- শুধু খাদ্য, পুষ্টি ও স্বাস্থ্য বিষয়ে কথা বলো
- কোনো রোগ নির্ণয় করবে না — প্রয়োজনে ডাক্তারের পরামর্শ নিতে বলো
- বাংলাদেশি খাবার সাজেস্ট করো
- সংক্ষিপ্ত, উষ্ণ ভাষায় উত্তর দাও (সর্বোচ্চ ৩টি পরামর্শ)

ব্যবহারকারী: ${profile.name || 'বন্ধু'}, ${profile.age || 30} বছর
ওজন: ${profile.weight_kg || 65}কেজি, লক্ষ্য: ${profile.goal || 'maintain'}
সমস্যা: ${profile.conditions?.join(', ') || 'নেই'}
আজ পর্যন্ত: ${todayLog.calories || 0}/${profile.calorie_target || 1800} kcal`;
}

async function scanFood(imageBase64, mimeType = 'image/jpeg', userProfile = {}) {
  if (!genAI) {
    return { items: MOCK_FOODS, plate_description_bn: 'ভাত + ডাল + মাছ', mocked: true };
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: { responseMimeType: 'application/json' },
  });
  const prompt = `তুমি একজন বাংলাদেশি খাদ্য বিশেষজ্ঞ। এই ছবিতে কী খাবার আছে বিশ্লেষণ করো।
শুধু এই JSON স্কিমা অনুসরণ করে উত্তর দাও:
{
  "items":[{"food_name_bn":"","food_name_en":"","estimated_quantity_g":150,"confidence":"high|medium|low","is_cooked":true,"category":"rice|dal|fish|meat|vegetable|fruit|snack|dairy|other"}],
  "plate_description_bn":""
}`;
  const result = await model.generateContent([
    { inlineData: { mimeType, data: imageBase64 } },
    prompt,
  ]);
  return safeParseJSON(result.response.text(), { items: [], plate_description_bn: '' });
}

async function chat(userMessage, userProfile = {}, todayLog = {}, history = []) {
  if (!genAI) {
    // Simple rule-based mock
    const m = userMessage.toLowerCase();
    if (/(ডায়াবেট|diabet)/i.test(userMessage))
      return 'ডায়াবেটিকদের জন্য কম GI খাবার ভালো — মসুর ডাল, পুঁই শাক, করলা। ভাত কম খেয়ে রুটি বাড়ান।';
    if (/(protein|প্রোটিন)/i.test(userMessage))
      return 'প্রোটিন বাড়াতে: ডিম, মাছ, ডাল, মুরগি। দিনে অন্তত ৬০-৮০গ্রাম প্রোটিন লক্ষ্য রাখুন।';
    if (/(বাজেট|budget)/i.test(userMessage))
      return '১৫০ টাকায়: ডিম+ভাত (৩০৳), ডাল-ভাত (৪০৳), ছোট মাছ+শাক (৭০৳) — মোট প্রোটিন ~৪৫গ্রাম।';
    return 'আমি আপনার পুষ্টি সহায়ক। খাবার ও স্বাস্থ্য নিয়ে প্রশ্ন করুন।';
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: buildSystemPrompt(userProfile, todayLog),
  });
  const limitedHistory = history.slice(-10).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  const chatSession = model.startChat({ history: limitedHistory });
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
}

async function getRecommendations(userProfile = {}, todayLog = {}, budget = null) {
  if (!genAI) {
    return {
      recommendations: [
        { meal_name_bn: 'মসুর ডাল + ভাত', reason_bn: 'প্রোটিন + ফাইবার, কম GI', estimated_calories: 380, key_nutrients: ['প্রোটিন', 'আয়রন'], estimated_cost_bdt: 35, is_diabetic_safe: true },
        { meal_name_bn: 'ডিম + রুটি', reason_bn: 'উচ্চ প্রোটিন', estimated_calories: 340, key_nutrients: ['প্রোটিন', 'ভিটামিন B12'], estimated_cost_bdt: 30, is_diabetic_safe: true },
        { meal_name_bn: 'লাল শাক + ছোট মাছ + ভাত', reason_bn: 'আয়রন বুস্ট', estimated_calories: 420, key_nutrients: ['আয়রন', 'ক্যালসিয়াম'], estimated_cost_bdt: 60, is_diabetic_safe: true },
      ],
      mocked: true,
    };
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: { responseMimeType: 'application/json' },
  });
  const budgetClause = budget ? `বাজেট ${budget} টাকা।` : '';
  const prompt = `${buildSystemPrompt(userProfile, todayLog)}\n${budgetClause}\nআজকের জন্য ঠিক ৩টি বাংলাদেশি খাবার সাজেস্ট করো। শুধু এই JSON স্কিমা ফেরত দাও:\n{"recommendations":[{"meal_name_bn":"","reason_bn":"","estimated_calories":300,"key_nutrients":[""],"estimated_cost_bdt":50,"is_diabetic_safe":true}]}`;
  const result = await model.generateContent(prompt);
  return safeParseJSON(result.response.text(), { recommendations: [] });
}

function safeParseJSON(text, fallback) {
  const cleaned = String(text || '').replace(/```json|```/g, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch {}
  }
  console.warn('[gemini] JSON parse failed, returning fallback. Raw:', cleaned.slice(0, 200));
  return fallback;
}

module.exports = { scanFood, chat, getRecommendations, hasKey };
