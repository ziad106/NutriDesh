# Ziad — Chat + Integration + Merges

**Branch:** `feat/chat` · **Role:** lead, AI chat, integration glue, code reviewer/merger

> Read [`team/README.md`](README.md) first. You also own **Task 0** (the file split) which everyone else waits on — do it before anything else.

## What you own (edit freely)
- Backend: `services/gemini/{client,chat,recommend,index}.js`, `routes/chat.js`, `routes/recommendations.js`, `server.js`
- App AI client: `src/services/api/index.js`, `src/services/api/chat.js`, `src/services/api/recommend.js`
- Chat: `src/screens/chat/ChatScreen.jsx`, `src/store/slices/chatSlice.js`, `src/store/slices/uiSlice.js`, `src/components/chat/*`
- Glue: `src/navigation/*`, `App.js`
- The keep-alive / Render deploy

## Do NOT edit (ping the owner)
- `services/gemini/scan.js`, `routes/scan.js`, `data/foods.js`, scan screens → **Shimul**
- Supabase, sync, storage, data slices (`auth/profile/mealLog`), auth screens, `store/index.js`, `store/persistence.js` → **Sher**
- home/* and profile/* screens, `api/data.js`, `components/common/*` → **Mohaiminul**

---

## TASK 0 — Split shared files (do FIRST, before anyone branches)

Goal: turn the two big shared files into folders so each teammate owns a separate piece. **Keep all exports identical** so no other imports break.

### 0a. Split the backend Gemini service
Current: `nutridesh-backend/services/gemini.js` (one file). Create folder `services/gemini/`:
- `client.js` — the `GoogleGenerativeAI` init + `hasKey` (lines 1–19 of the old file). Export `{ genAI, hasKey }`.
- `scan.js` — `scanFood()` + `MOCK_FOODS`. Import `genAI` from `./client`. *(Shimul will rewrite this; just move it as-is for now.)*
- `chat.js` — `chat()` + `buildSystemPrompt()`. Import `genAI` from `./client`.
- `recommend.js` — `getRecommendations()` + shared `safeParseJSON()`. Import `genAI` from `./client`.
- `index.js` — re-export everything so existing `require('../services/gemini')` keeps working:
  ```js
  const { hasKey } = require('./client');
  const { scanFood } = require('./scan');
  const { chat } = require('./chat');
  const { getRecommendations } = require('./recommend');
  module.exports = { scanFood, chat, getRecommendations, hasKey };
  ```
- **Delete** the old `services/gemini.js` (Node resolves `services/gemini` → `gemini/index.js`).

**Acceptance:** `npm run dev` starts; `POST /api/chat`, `/api/scan/food`, `/api/recommendations` all behave exactly as before. No route file changed.

### 0b. Split the app API client
Current: `nutridesh-app/src/services/api.js`. Create folder `src/services/api/`:
- `client.js` — `API_URL`, `fetchWithTimeout`, `postJSON`, `API_BASE`.
- `scan.js` — `scanFood()` + `pickEmoji()`. *(Shimul rewrites later.)*
- `chat.js` — `chat()`.
- `recommend.js` — `getRecommendations()`.
- `data.js` — `predictDeficiencies()`, `whatCanICook()`. *(Mohaiminul owns later.)*
- `index.js` — re-export everything so `import ... from '../services/api'` keeps working:
  ```js
  export * from './scan';
  export * from './chat';
  export * from './recommend';
  export * from './data';
  export { API_BASE } from './client';
  ```
- **Delete** the old `src/services/api.js`.

**Acceptance:** app builds, every screen that imports from `services/api` still works (mock fallback intact).

### 0c. Merge Task 0 to `main` and announce
```bash
git checkout -b chore/modularize
git add -A && git commit -m "chore: modularize gemini + api for parallel work"
git push -u origin chore/modularize
# open PR, merge to main
```
Then post in the group: **"Task 0 merged — pull main and branch now."**

---

## Your feature work (after Task 0)

### 1. Trilingual chat (Bangla / Banglish / English)
In `services/gemini/chat.js`, rewrite `buildSystemPrompt()` so the assistant **mirrors the user's language and script**:
- If the user writes Bangla script → reply Bangla.
- If the user writes romanized Bangla (Banglish, e.g. "ami ki khabo") → reply Banglish.
- If English → reply English.
Add an explicit line in the system prompt instructing this, and pass an optional `language` hint from the client (from `uiSlice`) when the user has set a preference.

**Acceptance:** the same question in 3 scripts gets 3 matching-language answers.

### 2. Proactive chat
Use `todayLog` (calories so far, target) and `profile` (goal, conditions) already passed into `chat()`:
- Seed the chat with a proactive opener when the screen mounts (e.g. "৪০০ kcal বাকি, প্রোটিন কম — ডিম খেতে পারেন?").
- End answers with one relevant follow-up nudge.

**Acceptance:** opening the chat with a half-full day shows a tailored suggestion, not a blank screen.

### 3. Language param plumbing
- Add a `language` field to `uiSlice` (`'auto' | 'bn' | 'banglish' | 'en'`).
- `src/services/api/chat.js` sends it to `/api/chat`.
- `ChatScreen.jsx` TTS: pick voice by detected/selected language instead of hardcoded `bn-BD` ([currently line 71](../nutridesh-app/src/screens/chat/ChatScreen.jsx#L71)).

### 4. Model upgrade
In `chat.js` and `recommend.js`, switch model `gemini-1.5-flash` → `gemini-2.5-flash`.

---

## Integration duties (ongoing, all 3 days)
- Review + merge every PR. Check the ownership matrix isn't violated and the app still builds.
- Keep `main` green. Backend merges auto-deploy to Render — don't merge a broken backend.
- **Keep-alive:** set up UptimeRobot → HTTP monitor on `https://nutridesh.onrender.com/ping` every 5 min (kills the cold-start problem). Free account.
- Provide the `GEMINI_API_KEY` to teammates for their local `.env`.

## Test
```bash
cd nutridesh-backend && npm run dev
cd nutridesh-app && npm start
```
Chat in all 3 languages; confirm proactive opener; confirm TTS language switches.

## Definition of done
- [ ] Task 0 merged Day 1 morning, team unblocked
- [ ] Chat mirrors Bangla / Banglish / English
- [ ] Chat is proactive (opener + follow-ups)
- [ ] Model on `gemini-2.5-flash`
- [ ] All PRs reviewed/merged, `main` always runnable
- [ ] Keep-alive live
