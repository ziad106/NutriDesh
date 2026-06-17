# NutriDesh 🌿

**আপনার পরিবারের পুষ্টি সঙ্গী — Your Family's Nutrition Companion**

Bangladesh-focused nutrition tracker with AI food scanning, Bangla chat assistant, diabetes/pregnancy modes, and budget meal planning.

## What's inside

- **`nutridesh-app/`** — Expo React Native mobile app (iOS + Android + Web)
- **`nutridesh-backend/`** — Express API with Gemini AI integration

Both ship with **mock data and mock AI** so the app runs end-to-end without any API keys. Add `GEMINI_API_KEY` to enable real Gemini scanning.

---

## Quick start

### 1. Mobile app

```bash
cd nutridesh-app
npm install
npx expo start
```

Then scan the QR code with **Expo Go** app (iOS App Store / Google Play) on your phone, OR press:
- `i` — open in iOS simulator
- `a` — open in Android emulator
- `w` — open in web browser

### 2. Backend (optional — app works without it)

```bash
cd nutridesh-backend
npm install
npm start
```

API runs on `http://localhost:3000`. Health check: `GET /` and `GET /ping`.

### 3. Enable real AI (optional)

1. Get free Gemini API key from https://aistudio.google.com (no credit card)
2. `cd nutridesh-backend && echo "GEMINI_API_KEY=your_key_here" >> .env`
3. `npm install @google/generative-ai` (already listed as optional dep)
4. Restart server. `GET /` will report `"gemini": "live"`.

---

## Features

### Home
- Daily nutrition ring (calories remaining, animated)
- Macro pills (protein / carbs / fat with progress bars)
- Micronutrient chips (iron, calcium, vitamin A, folate)
- AI insight card (dynamic based on deficiencies)
- Deficiency alert (iron, calcium thresholds)
- Today's meals timeline
- Quick actions: scan / chat / budget / cook
- Seasonal food carousel
- Streak counter

### Scanner
- Live camera preview (Expo Camera)
- Gallery import + voice fallback
- Meal-type selector (breakfast/lunch/dinner/snack)
- Animated cooking-pot loader during scan
- Multi-item result with confidence badges
- Portion sliders + presets (80g / 150g / 250g)
- GI traffic light for diabetics
- Manual food search (50+ Bangladeshi foods)

### Chat
- Bangla AI assistant (পুষ্টি সহায়ক)
- Quick-reply chips (diabetes, protein, budget, ramadan, child)
- Typing dots animation
- Bangla TTS (tap 🔊 to hear response)
- Rule-based mock; swap to Gemini with one env var

### Profile & modes
- Editable health profile (auto-recalculates calorie/macro/micro targets)
- Family members CRUD
- Child profile with WHO stunting/underweight assessment
- Diabetes mode (glucose log, GI summary, sodium alert, doctor PDF)
- Pregnancy mode (trimester targets, recommended/avoid foods)
- Ramadan mode (sehri/iftar plans, hydration tracker)
- Shastho Shebika portal (PIN-locked, family list, PDF reports)
- Settings (language toggle, dark mode, notifications)
- Privacy & consent screen

### Other
- Weekly report (7-day averages → PDF export via expo-print)
- Budget meal planner (৳50–৳300, bazaar price table)
- "What can I cook?" with ingredient picker + recipe gen
- Mood / energy logger

---

## Architecture

```
Frontend (Expo SDK 51)
├── Redux Toolkit (auth, profile, mealLog, chat, ui)
├── React Navigation 6 (Stack + Bottom Tabs)
├── React Native Paper (Material 3 theme)
├── React Native Reanimated 2 (ring, dots, splash, loader)
└── AsyncStorage (offline persistence — wired but not auto-rehydrating)

Backend (Node 20 + Express)
├── Helmet + compression + morgan
├── express-rate-limit (10 req/min on AI routes)
├── In-memory cache (TTL 30 days, for scan/chat)
└── Gemini service (auto-mock if no API key)
```

---

## Database schema (Supabase)

When ready to enable cloud sync, run the SQL from the original spec (`NUTRIDESH_MASTER_PROMPT.md` section 4). RLS policies are included.

---

## Disclaimer

NutriDesh is a tracking and education tool, **not a medical device**. Consult a registered dietician or physician for medical decisions.

Built for Bangladesh. Powered by AI. Costs nothing.
