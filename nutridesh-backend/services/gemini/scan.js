// Food scanning. OWNER: Shimul (feat/scan). Rewrite freely — add the non-food
// gate, structured output, nutrition grounding, and model upgrade here.
const { genAI, safeParseJSON } = require('./client');

const MOCK_FOODS = [
  { food_name_bn: 'সাদা ভাত', food_name_en: 'White Rice', estimated_quantity_g: 150, confidence: 'high', is_cooked: true, category: 'rice' },
  { food_name_bn: 'মসুর ডাল', food_name_en: 'Masoor Dal', estimated_quantity_g: 100, confidence: 'high', is_cooked: true, category: 'dal' },
  { food_name_bn: 'রুই মাছ', food_name_en: 'Rui Fish', estimated_quantity_g: 120, confidence: 'medium', is_cooked: true, category: 'fish' },
];

async function scanFood(imageBase64, mimeType = 'image/jpeg', userProfile = {}) {
  if (!genAI) {
    return { items: MOCK_FOODS, plate_description_bn: 'ভাত + ডাল + মাছ', mocked: true };
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
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

module.exports = { scanFood, MOCK_FOODS };
