// Chat + shared system prompt. OWNER: Ziad (feat/chat). Make trilingual +
// proactive here. buildSystemPrompt is also used by recommend.js.
const { genAI } = require('./client');

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

async function chat(userMessage, userProfile = {}, todayLog = {}, history = []) {
  if (!genAI) {
    // Simple rule-based mock
    if (/(ডায়াবেট|diabet)/i.test(userMessage))
      return 'ডায়াবেটিকদের জন্য কম GI খাবার ভালো — মসুর ডাল, পুঁই শাক, করলা। ভাত কম খেয়ে রুটি বাড়ান।';
    if (/(protein|প্রোটিন)/i.test(userMessage))
      return 'প্রোটিন বাড়াতে: ডিম, মাছ, ডাল, মুরগি। দিনে অন্তত ৬০-৮০গ্রাম প্রোটিন লক্ষ্য রাখুন।';
    if (/(বাজেট|budget)/i.test(userMessage))
      return '১৫০ টাকায়: ডিম+ভাত (৩০৳), ডাল-ভাত (৪০৳), ছোট মাছ+শাক (৭০৳) — মোট প্রোটিন ~৪৫গ্রাম।';
    return 'আমি আপনার পুষ্টি সহায়ক। খাবার ও স্বাস্থ্য নিয়ে প্রশ্ন করুন।';
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
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

module.exports = { chat, buildSystemPrompt };
