// Chat + shared system prompt. OWNER: Ziad (feat/chat). Trilingual (Bangla /
// Banglish / English) + proactive. buildSystemPrompt is also used by recommend.js.
const { genAI } = require('./client');

const MODEL = 'gemini-2.5-flash';

const LANG_RULES = {
  bn: 'সবসময় বাংলা ভাষায়, বাংলা হরফে উত্তর দাও।',
  banglish:
    'Always reply in Banglish — the Bangla language written in Roman/English letters (e.g. "apni beshi bhaat khaben na, daal-shobji beshi khan"). Do NOT use Bengali script and do NOT reply in pure English.',
  en: 'Always reply in clear English.',
  auto:
    'Reply in the SAME language and script the user used. Bengali script -> reply in Bengali script. Romanized Bangla (Banglish: Bangla written with English letters, e.g. "ami ki khabo") -> reply in Banglish, not Bengali script and not English. English -> reply in English. Re-check every message.',
};

function buildSystemPrompt(profile = {}, todayLog = {}, language = 'auto') {
  const langRule = LANG_RULES[language] || LANG_RULES.auto;
  const target = profile.calorie_target || 1800;
  const eaten = todayLog.calories || 0;
  const remaining = Math.max(0, target - eaten);
  const conditions = profile.conditions?.join(', ') || 'none';

  return `You are NutriDesh's nutrition assistant — a trusted, warm Bangladeshi nutritionist.

LANGUAGE: ${langRule}

RULES:
- Only discuss food, nutrition, and health. Politely decline anything else.
- Never diagnose disease; suggest seeing a doctor when appropriate.
- Recommend affordable, locally available Bangladeshi foods.
- Keep answers warm and concise — at most 3 suggestions.
- BE PROACTIVE: use the user's data below to give specific, tailored advice that moves them toward their goal, and when it helps, end with ONE short follow-up question.

USER: ${profile.name || 'friend'}, ${profile.age || 30} yrs, ${profile.weight_kg || 65}kg
Goal: ${profile.goal || 'maintain'}
Conditions: ${conditions}
Today so far: ${eaten}/${target} kcal (${remaining} kcal remaining)`;
}

async function chat(userMessage, userProfile = {}, todayLog = {}, history = [], language = 'auto') {
  if (!genAI) {
    return mockReply(userMessage);
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: buildSystemPrompt(userProfile, todayLog, language),
  });
  const limitedHistory = history.slice(-10).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  const chatSession = model.startChat({ history: limitedHistory });
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
}

// Rule-based fallback when no API key. Mirrors script loosely so offline demos
// still feel multilingual.
function mockReply(userMessage) {
  const isBangla = /[ঀ-৿]/.test(userMessage);
  if (/(ডায়াবেট|diabet)/i.test(userMessage))
    return isBangla
      ? 'ডায়াবেটিকদের জন্য কম GI খাবার ভালো — মসুর ডাল, পুঁই শাক, করলা। ভাত কম খেয়ে রুটি বাড়ান।'
      : 'For diabetes, prefer low-GI foods — masoor dal, pui shak, bitter gourd. Cut rice, add roti.';
  if (/(protein|প্রোটিন)/i.test(userMessage))
    return isBangla
      ? 'প্রোটিন বাড়াতে: ডিম, মাছ, ডাল, মুরগি। দিনে অন্তত ৬০-৮০গ্রাম প্রোটিন লক্ষ্য রাখুন।'
      : 'To boost protein: egg, fish, dal, chicken. Aim for 60-80g protein a day.';
  if (/(বাজেট|budget|taka|টাকা)/i.test(userMessage))
    return isBangla
      ? '১৫০ টাকায়: ডিম+ভাত (৩০৳), ডাল-ভাত (৪০৳), ছোট মাছ+শাক (৭০৳) — মোট প্রোটিন ~৪৫গ্রাম।'
      : 'On 150 taka: egg+rice (30), dal-rice (40), small fish+greens (70) — ~45g protein total.';
  return isBangla
    ? 'আমি আপনার পুষ্টি সহায়ক। খাবার ও স্বাস্থ্য নিয়ে প্রশ্ন করুন।'
    : "I'm your nutrition assistant. Ask me anything about food and health.";
}

module.exports = { chat, buildSystemPrompt };
