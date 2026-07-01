// Shared Gemini client + helpers. Falls back to mock if GEMINI_API_KEY not set
// or the SDK isn't installed.
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

module.exports = { genAI, hasKey, safeParseJSON };
