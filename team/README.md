# NutriDesh — Team Build Plan (3-Day Sprint)

> **Read this file first.** It is the single source of truth for who owns what, how we branch, and how we avoid stepping on each other. Each person also has their own task file — open the one with your name.

- **Goal:** Take NutriDesh from "demo with dead buttons" to a **fully working, production-ready** app in 3 days for the showcase competition.
- **Repo:** https://github.com/ziad106/NutriDesh (monorepo — both app and backend live here)
- **Team:** Ziad (lead), Shimul (scan AI), Sher (database), Mohaiminul (UI)

---

## 1. Your task file

| Person | Role | Task file | Branch |
|---|---|---|---|
| **Shimul** | Scan AI pipeline | [`team/01-shimul-scan.md`](01-shimul-scan.md) | `feat/scan` |
| **Ziad** | Chat + integration + merges | [`team/02-ziad-chat-integration.md`](02-ziad-chat-integration.md) | `feat/chat` |
| **Sher** | Supabase (DB + auth + sync) | [`team/03-sher-supabase.md`](03-sher-supabase.md) | `feat/db` |
| **Mohaiminul** | UI wiring (kill dead buttons) | [`team/04-mohaiminul-ui.md`](04-mohaiminul-ui.md) | `feat/ui` |

---

## 2. Project context (so the repo makes sense when you pull)

### Architecture
```
nutridesh-app/        React Native + Expo (SDK 54). Redux Toolkit + AsyncStorage.
nutridesh-backend/    Node + Express. Calls Google Gemini for AI. Deployed on Render.
```

- **App → Express backend** for AI only: `/api/scan/food`, `/api/chat`, `/api/recommendations`.
- **App → Supabase directly** (added this sprint by Sher) for all user data: profiles, meal logs, chat history. Express stays AI-only.
- AI provider is **Google Gemini** (`@google/generative-ai`). Not OpenAI, not Claude.

### Live backend
- URL: `https://nutridesh.onrender.com` (Render free tier).
- Health check: `GET /ping` → `{"status":"ok"}`.
- **Free tier sleeps after 15 min idle** → first request after sleep takes ~60–120s (cold start). Keep-alive (UptimeRobot pinging `/ping` every 5 min) prevents this. Ziad owns the keep-alive.
- Render **auto-deploys** when `main` is pushed. So: merging to `main` redeploys the backend in ~2 min.

### Current state / known problems we are fixing
1. **Scan misidentifies** — no "is this food?" gate, and the app **fabricates** mock food (rice+dal+fish) whenever the scan fails. Model is the old `gemini-1.5-flash`. → Shimul.
2. **Chat is Bangla-only and reactive** — needs Bangla / Banglish / English (mirror the user) + be proactive. → Ziad.
3. **No database** — profile/history only live on one phone, no accounts, no sync. → Sher.
4. **Dead buttons** — Settings "clear cache"/"export" are fake `Alert`s; several save actions don't persist; `whatCanICook` / `predictDeficiencies` are mock-only. → Mohaiminul.

---

## 3. Run it locally (everyone, before you start)

### Backend
```bash
cd nutridesh-backend
npm install
cp .env.example .env        # then put a real GEMINI_API_KEY in .env (ask Ziad for the key)
npm run dev                 # starts on http://localhost:3000, auto-restarts on change
```
Verify: open http://localhost:3000/ping → should return `{"status":"ok"}`.
> No `GEMINI_API_KEY`? The backend still runs in **mock mode** (returns canned data) so you can develop UI without the key.

### App
```bash
cd nutridesh-app
npm install
cp .env.example .env
npm start                   # opens Expo; press 'i' (iOS sim), 'a' (Android), or scan QR with Expo Go
```
Edit `nutridesh-app/.env`:
- Testing on the **iOS simulator / web** → `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Testing on a **real phone** → use your Mac's LAN IP, e.g. `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`
- Testing against **production** → `EXPO_PUBLIC_API_URL=https://nutridesh.onrender.com`

### Required env vars
| File | Var | Who provides |
|---|---|---|
| `nutridesh-backend/.env` | `GEMINI_API_KEY` | Ziad |
| `nutridesh-app/.env` | `EXPO_PUBLIC_API_URL` | self (see above) |
| `nutridesh-app/.env` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Sher (after Day 1) |

> `.env` is gitignored — secrets are **never** committed. Only `.env.example` is in git.

---

## 4. THE GOLDEN RULE — no overlapping edits

We avoid merge conflicts by **file ownership**, not by luck.

> **You may IMPORT from any file. You may only EDIT files you own.**
> Need a change inside someone else's file? Ping them on the group chat — they make the change. Do not edit it yourself.

### Ownership matrix (every editable file has exactly one owner)

| Area | Files | Owner |
|---|---|---|
| Backend scan AI | `services/gemini/scan.js`, `routes/scan.js`, `data/foods.js` | **Shimul** |
| Backend chat/recs AI | `services/gemini/{chat,recommend,client,index}.js`, `routes/chat.js`, `routes/recommendations.js`, `server.js` | **Ziad** |
| App AI client | `src/services/api/index.js`, `api/chat.js`, `api/recommend.js` | **Ziad** |
| App AI client (scan) | `src/services/api/scan.js` | **Shimul** |
| App AI client (data) | `src/services/api/data.js` | **Mohaiminul** |
| Scan screens | `src/screens/scan/*`, `src/data/foodsBD.js`, `src/components/scan/*` | **Shimul** |
| Chat screen | `src/screens/chat/*`, `src/store/slices/chatSlice.js`, `src/store/slices/uiSlice.js`, `src/components/chat/*` | **Ziad** |
| Supabase + data layer | `src/services/supabase.js`, `src/services/sync.js`, `src/services/storage.js`, `src/store/persistence.js`, `src/store/index.js` | **Sher** |
| Data slices | `src/store/slices/{auth,profile,mealLog}Slice.js` | **Sher** |
| Auth screens | `src/screens/auth/{Login,ProfileWizard,Splash}Screen.jsx` | **Sher** |
| All other screens (home/*, profile/*, Onboarding, LanguageSelect) | see Mohaiminul's file | **Mohaiminul** |
| Shared UI components | `src/components/common/*` | **Mohaiminul** |
| Navigation / App.js | `src/navigation/*`, `App.js` | **Ziad** |

If a file is not listed, ask in the group chat before editing.

### ⚠️ Day-1 gate (everyone waits for this)
Two shared files (`services/gemini.js` and `src/services/api.js`) are being **split into folders** by Ziad so we can each own a piece without conflicts. This is **Task 0**.

**Do not create your branch until Ziad posts "Task 0 merged to main."** Then:
```bash
git checkout main && git pull origin main   # get the split
git checkout -b feat/<your-area>            # now branch
```

---

## 5. Git workflow

1. **Branch from latest `main`** (after Task 0):
   ```bash
   git checkout main && git pull origin main
   git checkout -b feat/scan      # your branch name from the table above
   ```
2. **Commit small and often.** Message style: `scan: add non-food gate`, `ui: wire settings clear-cache`.
3. **Push your branch** (this is "where to push"):
   ```bash
   git push -u origin feat/scan
   ```
4. **Open a Pull Request** into `main` on GitHub. Add Ziad as reviewer.
5. **Ziad reviews + merges.** Never merge your own PR without his OK (he checks for cross-area breakage).
6. **Pull `main` every morning** before working: `git checkout main && git pull && git checkout feat/scan && git merge main`.

End all commit messages with:
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

> Backend changes merged to `main` auto-deploy to Render. Don't merge a broken backend.

---

## 6. Daily milestones

| Day | Target |
|---|---|
| **Day 1** | Ziad ships Task 0 first. Everyone builds the **core** of their module on their branch. EOD: **merge #1** — each branch at least compiles and runs. |
| **Day 2** | Integrate + wire everything together. EOD: **merge #2 = feature-complete** (all buttons do something real). |
| **Day 3 AM** | Bug-fix + polish (loading states, error states, empty states). **Code freeze at noon.** |
| **Day 3 PM** | **No new code.** Demo rehearsal, seed demo data, screenshots, pitch run-through. |

---

## 7. Definition of "production ready" (our acceptance bar)

Every screen must have:
- [ ] No fake `Alert` placeholders — every button does a real action or is removed.
- [ ] **Loading** state (spinner) while waiting on network.
- [ ] **Error** state (friendly message + retry) when a call fails.
- [ ] **Empty** state (helpful text) when there's no data.
- [ ] Data **persists** (Supabase + local cache) and survives app restart.

Feature-specific:
- [ ] Scan **refuses** to invent food — says "no food detected" honestly. Returns real nutrition numbers.
- [ ] Chat replies in the **same language** the user wrote (Bangla / Banglish / English) and is **proactive**.
- [ ] Login → profile → log meals → see history works across **app restarts and (bonus) a second device**.

---

## 8. Who to ping
- Anything blocking, any cross-file change, any "can I edit X?" → **Ziad** (lead + merger).
- Keep PRs small; ask early; pull `main` daily. That's how 4 people go 4× faster instead of 4× slower.
