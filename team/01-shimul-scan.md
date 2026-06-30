# Shimul — Scan AI Pipeline

**Branch:** `feat/scan` · **Role:** food scanning (the hardest, highest-impact module)

> Read [`team/README.md`](README.md) first. **Wait for Ziad's "Task 0 merged" message** before branching, then `git checkout main && git pull && git checkout -b feat/scan`.

You're the strongest coder, so you get the part that decides whether we win: **make the scanner accurate and honest.** Right now it invents food from random images. That must stop.

## What you own (edit freely)
- Backend: `services/gemini/scan.js`, `routes/scan.js`, `data/foods.js`
- App: `src/services/api/scan.js`, `src/screens/scan/ScannerScreen.jsx`, `src/screens/scan/ScanResultScreen.jsx`, `src/screens/scan/FoodSearchScreen.jsx`, `src/data/foodsBD.js`, `src/components/scan/*`

## Do NOT edit (ping the owner)
- `services/gemini/{client,chat,recommend,index}.js`, `api/index.js`, `api/chat.js` → **Ziad** (you `import` from them, never edit)
- Any store slice / `supabase.js` / `sync.js` → **Sher**. To save a scan into the meal log, dispatch the existing meal-log action; if you need a new action, ask Sher.

---

## The two root-cause bugs you're fixing
1. **Backend has no "is this food?" gate** — the prompt assumes food is present, so it hallucinates food from a wall/phone/face. ([`gemini.js` scanFood prompt](../nutridesh-backend/services/gemini.js#L51))
2. **Frontend fabricates food on failure** — if the scan returns empty, the app shows canned rice+dal+fish. ([`api.js:42-50`](../nutridesh-app/src/services/api.js#L42)) This is likely the exact symptom Ziad reported.

## Architecture (what good looks like)
Mirror how Passio / Calorie Mama work: **detect → confidence gate → map to nutrition DB → structured output.** We use Gemini 2.5 Flash as the detector instead of a trained CNN (zero-shot Gemini 2.5 Flash hits ~92% on food recognition, so no fine-tuning needed).

---

## Steps

### 1. Upgrade model + enforce a schema
In `services/gemini/scan.js`:
- Model `gemini-1.5-flash` → **`gemini-2.5-flash`**.
- Use Gemini **structured output** (`responseSchema` in `generationConfig`) so the model can't return free-form text. Schema must include the gate fields below.

### 2. Add the non-food gate (the key fix)
New response shape from the model:
```json
{
  "is_food": true,
  "overall_confidence": 0.0,
  "reason_bn": "ছবিতে কোনো খাবার পাওয়া যায়নি",
  "items": [
    {"food_name_bn":"","food_name_en":"","estimated_quantity_g":150,
     "confidence":0.0,"is_cooked":true,"category":"rice|dal|fish|meat|vegetable|fruit|snack|dairy|other"}
  ],
  "plate_description_bn": ""
}
```
Rewrite the prompt to **first decide if the image actually contains food**. If not food, or `overall_confidence < 0.55`, return `is_food:false`, empty `items`, and a `reason_bn`. Do not force-fill items.

### 3. Ground to the nutrition DB + return real numbers
- Expand `nutridesh-backend/data/foods.js` from 18 → **~120 common Bangladeshi foods** (rice/dal/fish/meat/veg/fruit/snack/dairy + popular dishes: khichuri, biryani, polao, paratha, shingara, samosa, fuchka, etc.) with calories/protein/carbs/fat/iron/calcium/GI per 100g.
- Pass the DB's food names to the model as the **preferred vocabulary** so it maps to known dishes.
- In `routes/scan.js` (or scan.js), after detection, **join each item to `foods.js`** and compute nutrition scaled by `estimated_quantity_g`. Return per-item `{calories, protein, carbs, fat, iron, calcium, gi}` plus a plate total.

### 4. Kill the frontend fabrication
In `src/services/api/scan.js` (your file after Task 0):
- Remove the `mockScanFood()` fallback on empty result.
- If `is_food:false` or `items` empty → return a clean "no food" result, **not** mock data.
- Keep mock fallback **only** for a true network error (backend unreachable), and label it clearly.

### 5. Honest scan UX
- `ScannerScreen.jsx`: loading spinner during scan; on cold start (first request can take ~60–120s if Render slept) show "একটু সময় লাগছে…" instead of timing out silently.
- `ScanResultScreen.jsx`: if no food → friendly "কোনো খাবার শনাক্ত হয়নি, আবার তুলুন" with a retake button. If low-confidence items → mark them and let the user confirm/edit grams before logging.
- Show the real nutrition numbers per item + plate total.
- "Log this meal" dispatches the meal-log action (Sher's slice) so it persists.

### 6. Food search screen
- `FoodSearchScreen.jsx`: wire search against `src/data/foodsBD.js` (expand it to match the backend list). Tapping a result adds it to the log. No dead buttons.

## Test
- Scan a real plate → correct items + nutrition.
- Scan a **wall / phone / face** → "no food detected", **never** fake rice+dal+fish.
- Scan with backend in mock mode (no API key) → still behaves sanely.

## Definition of done
- [ ] `gemini-2.5-flash` + enforced `responseSchema`
- [ ] Non-food gate works (random object → honest "no food")
- [ ] Real nutrition numbers returned, grounded in `foods.js` (~120 items)
- [ ] Frontend no longer fabricates food on empty
- [ ] Scanner has loading / no-food / low-confidence states
- [ ] Food search functional
