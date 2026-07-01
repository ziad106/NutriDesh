// Meal recommendations. OWNER: Ziad (feat/chat). Uses the shared system prompt.
const { genAI, safeParseJSON } = require('./client');
const { buildSystemPrompt } = require('./chat');

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
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });
  const budgetClause = budget ? `বাজেট ${budget} টাকা।` : '';
  const prompt = `${buildSystemPrompt(userProfile, todayLog)}\n${budgetClause}\nআজকের জন্য ঠিক ৩টি বাংলাদেশি খাবার সাজেস্ট করো। শুধু এই JSON স্কিমা ফেরত দাও:\n{"recommendations":[{"meal_name_bn":"","reason_bn":"","estimated_calories":300,"key_nutrients":[""],"estimated_cost_bdt":50,"is_diabetic_safe":true}]}`;
  const result = await model.generateContent(prompt);
  return safeParseJSON(result.response.text(), { recommendations: [] });
}

module.exports = { getRecommendations };
