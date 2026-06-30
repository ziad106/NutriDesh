# Sher — Supabase: Database + Auth + Sync

**Branch:** `feat/db` · **Role:** make NutriDesh real — accounts, cloud data, cross-device history

> Read [`team/README.md`](README.md) first. **Wait for Ziad's "Task 0 merged" message** before branching, then `git checkout main && git pull && git checkout -b feat/db`.

You're the DB expert, so you own the entire data layer end-to-end. Today the app saves everything to one phone's local storage only — no accounts, nothing syncs. You're adding **Supabase** so users log in and their profile + meal history follow them across restarts and devices.

## Architecture decision (important)
**The app talks to Supabase directly** using `supabase-js` + Row Level Security. The Express backend stays AI-only. This keeps your work in its own files and out of everyone else's way.
- Use the **anon key** in the app (safe with RLS), not a service key.
- Keep Redux + AsyncStorage as a **local cache** (offline-first). Write through to Supabase when online; hydrate from Supabase on login.

## What you own (edit freely)
- New: `src/services/supabase.js`, `src/services/sync.js`
- Data layer: `src/services/storage.js`, `src/store/persistence.js`, `src/store/index.js`
- Data slices: `src/store/slices/authSlice.js`, `src/store/slices/profileSlice.js`, `src/store/slices/mealLogSlice.js`
- Auth screens: `src/screens/auth/LoginScreen.jsx`, `src/screens/auth/ProfileWizardScreen.jsx`, `src/screens/auth/SplashScreen.jsx`
- `src/services/api/` — **no.** `nutridesh-app/.env.example` — yes (add the Supabase vars)
- The Supabase project itself (tables, RLS, auth settings)

## Do NOT edit (ping the owner)
- `chatSlice.js`, `uiSlice.js`, chat screen → **Ziad**
- Scan screens, scan slice usage → **Shimul**
- home/* and profile/* (non-auth) screens → **Mohaiminul**. They will **call your slice actions** — give them clear action names; if they need a new action, you add it.

---

## Steps

### 1. Create the Supabase project (free tier)
- New project at supabase.com. Note the **Project URL** and **anon public key**.
- Add to `nutridesh-app/.env.example`:
  ```
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_ANON_KEY=
  ```
- Share the real URL + anon key with the team so they fill their own `.env`. (Anon key is public-safe.)

### 2. Schema (SQL editor)
```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text, age int, weight_kg numeric, goal text,
  conditions text[], calorie_target int, language text,
  updated_at timestamptz default now()
);
create table meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  food_name text, grams numeric,
  calories numeric, protein numeric, carbs numeric, fat numeric,
  iron numeric, calcium numeric, gi numeric,
  logged_at timestamptz default now()
);
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  role text, content text, created_at timestamptz default now()
);
create table glucose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  mmol numeric, logged_at timestamptz default now()
);
-- family_members / child_profiles: same pattern, user_id + fields
```
**Enable RLS on every table** and add policies so each user sees only their rows:
```sql
alter table profiles enable row level security;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
-- repeat per table using auth.uid() = user_id
```

### 3. Auth — free constraint (READ THIS)
Supabase **phone OTP needs a paid SMS provider (Twilio)** — we can't use it for free. Use one of:
- **Email magic link** (recommended, zero cost, simplest), or
- **Email + password**.

Keep the existing login UI styling, but back it with email. Update `LoginScreen.jsx` accordingly. (If the team insists on the phone-OTP look for the demo, you can keep the 4-digit field as a cosmetic step and authenticate with email underneath — decide with Ziad.)

### 4. `supabase.js`
Create the client:
```js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
);
```
> `@supabase/supabase-js` is already in node_modules; if missing, `npm install @supabase/supabase-js`.

### 5. `sync.js` + wire into slices
- On **login**: pull profile, meal_logs, chat_messages from Supabase → hydrate Redux.
- On **change**: when `profile`/`mealLog` actions fire, write through to Supabase (you already have `persistMiddleware` in `store/persistence.js` doing local saves — extend it to also push to Supabase when authenticated).
- Offline: keep writing to AsyncStorage; queue and flush to Supabase when back online (a simple "dirty flag + retry on reconnect" is enough for the demo).
- `SplashScreen.jsx`: on launch, restore the Supabase session and hydrate before routing to Home vs Login.

### 6. Logout / clear
- Logout (`ProfileScreen` is Mohaiminul's, but the action is yours): `supabase.auth.signOut()` + clear local cache via `storage.clearAll()`.

## Test
- Sign up → fill profile (ProfileWizard) → log a meal → **kill the app** → reopen → still logged in, data present.
- Bonus: log in on a **second device/simulator** → same profile + history appears.
- Airplane mode → log a meal → reconnect → it appears in Supabase.

## Definition of done
- [ ] Supabase project + tables + RLS live; anon key shared
- [ ] Email auth (magic link or password) working
- [ ] Profile + meal logs + chat history sync to cloud
- [ ] Session restored on app launch
- [ ] Offline writes flush on reconnect
- [ ] `.env.example` updated with Supabase vars
