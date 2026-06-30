# Mohaiminul — UI Wiring (Kill Every Dead Button)

**Branch:** `feat/ui` · **Role:** make every screen and button actually work + look production-ready

> Read [`team/README.md`](README.md) first. **Wait for Ziad's "Task 0 merged" message** before branching, then `git checkout main && git pull && git checkout -b feat/ui`.

Your job is the most visible at the demo: when a judge taps anything, it must do something real — no fake popups, no dead buttons. You'll lean on Claude Code a lot; this file gives it exact, bounded tasks so it can't wander.

## How to work with Claude Code (important for you)
- Do **one screen at a time.** Give Claude Code the screen file + the checklist below for that screen.
- After each screen: run the app, tap every button yourself, then commit.
- If a task needs a file you don't own (a slice, a service), **stop and ask the owner** — don't let Claude edit it. You only IMPORT and call their functions.

## What you own (edit freely)
- Home screens: `src/screens/home/*` (HomeScreen, MealLogScreen, MoodEnergyScreen, RamadanModeScreen, RecommendationsScreen, WeeklyReportScreen, WhatCanICookScreen, BudgetMealScreen)
- Profile screens: `src/screens/profile/*` (ProfileScreen, SettingsScreen, HealthProfileEditScreen, FamilyMembersScreen, ChildProfileScreen, DiabetesModeScreen, PregnancyModeScreen, ConsentScreen, ShasthoShebikaPortalScreen)
- `src/screens/auth/OnboardingScreen.jsx`, `src/screens/auth/LanguageSelectScreen.jsx`
- `src/services/api/data.js` (whatCanICook, predictDeficiencies)
- `src/components/common/*`

## Do NOT edit (import only, ping owner if a change is needed)
- Any `src/store/slices/*` → **Sher** (auth/profile/mealLog) or **Ziad** (chat/ui). You **call** their actions with `dispatch(...)`; if an action is missing, ask them to add it.
- `src/services/supabase.js`, `sync.js`, `storage.js`, `store/*` → **Sher**
- `api/index.js`, `api/chat.js`, `api/recommend.js` → **Ziad** · `api/scan.js`, scan screens → **Shimul**
- Auth Login/ProfileWizard/Splash → **Sher**

---

## The standard you apply to EVERY screen
For each screen, make sure it has all four:
1. **Loading** — spinner/skeleton while any async work runs.
2. **Error** — friendly message + a retry button when something fails.
3. **Empty** — helpful text when there's no data yet (not a blank page).
4. **Real action** — buttons persist data (dispatch to the store, which Sher syncs to Supabase) or navigate somewhere real. No `Alert.alert('...done')` that doesn't actually do the thing.

---

## Known fake buttons to fix first (confirmed dead)
- `SettingsScreen.jsx` "clear cache" → currently just an Alert. Make it call `storage.clearAll()` (import from `services/storage`, owned by Sher — import only) and show a real confirmation. ([line 50](../nutridesh-app/src/screens/profile/SettingsScreen.jsx#L50))
- `SettingsScreen.jsx` "export data" → actually build a JSON of the user's logs and share it via `expo-sharing`/`Share`, not a fake Alert. ([line 53](../nutridesh-app/src/screens/profile/SettingsScreen.jsx#L53))
- `whatCanICook` / `predictDeficiencies` are **mock-only** in `api/data.js` ([api.js:80-86](../nutridesh-app/src/services/api.js#L80)). Keep them functional: either call the real `/api/recommendations` (ask Ziad for the shape) or keep a *good* deterministic version — but the screen must show real, varying results, with loading/empty states.

---

## Per-screen checklist (work top to bottom)

### Home
- `HomeScreen.jsx` — the hub. Every card/quick-action navigates to a real screen (they mostly do). Add loading/empty states for the day's summary. Pull data from selectors (read-only).
- `MealLogScreen.jsx` — list today's logged meals from `mealLog` state. Empty state when none. Delete/edit a log dispatches the meal-log action (ask Sher for the action name).
- `RecommendationsScreen.jsx` — call `getRecommendations` (from `services/api`, Ziad's). Loading spinner, error+retry, render the 3 cards. **Has buttons with no `onPress` today — wire them.**
- `WhatCanICookScreen.jsx` — input ingredients → call `whatCanICook` → render results. Loading/empty/error.
- `BudgetMealScreen.jsx` — take a budget → show meals within it (use recommendations with the budget param). Loading/empty.
- `WeeklyReportScreen.jsx` — PDF export already exists; make sure it uses real logged data and handles the failure path.
- `MoodEnergyScreen.jsx` — mood selection persists (dispatch to mealLog/mood action — ask Sher). Replace the placeholder Alerts with a real save + toast.
- `RamadanModeScreen.jsx` — make the toggles/settings persist.

### Profile
- `ProfileScreen.jsx` — show real profile data; logout button calls Sher's logout flow (ask Sher for the function). 
- `SettingsScreen.jsx` — clear cache + export (see above); make any toggles persist.
- `HealthProfileEditScreen.jsx` — edits dispatch `setProfile` and persist (don't just Alert).
- `FamilyMembersScreen.jsx` / `ChildProfileScreen.jsx` — add/list members persists via the existing actions; empty states.
- `DiabetesModeScreen.jsx` — glucose reading saves to the glucose log (ask Sher for the action); list past readings; PDF export handles errors.
- `PregnancyModeScreen.jsx` — **has buttons with no `onPress` today — wire them.** Persist settings.
- `ConsentScreen.jsx` / `ShasthoShebikaPortalScreen.jsx` — make the PIN gate + actions real; no dead buttons.

### Auth (UI only — login itself is Sher's)
- `OnboardingScreen.jsx` — carousel + "get started" navigates correctly.
- `LanguageSelectScreen.jsx` — selecting a language dispatches `setLanguage` (existing action) and routes on.

### Shared components
- `src/components/common/*` — polish LoadingLoader, cards, etc. Make a reusable `<LoadingState/>`, `<ErrorState onRetry/>`, `<EmptyState/>` so every screen uses the same ones.

## Test
Walk the whole app and tap **everything**. Nothing should pop a fake "done" without actually doing it. Restart the app — your saved data should still be there (Sher's sync handles persistence).

## Definition of done
- [ ] No `Alert.alert` placeholder that doesn't perform the real action
- [ ] Every screen has loading + error + empty states
- [ ] Buttons currently missing `onPress` (Recommendations, PregnancyMode) are wired
- [ ] Settings clear-cache + export do real work
- [ ] whatCanICook / budget / recommendations show real results
- [ ] Reusable LoadingState / ErrorState / EmptyState components used app-wide
