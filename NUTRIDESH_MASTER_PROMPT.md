# NutriDesh — Complete Build Specification
## End-to-End Deployable Product Prompt

> **This document is a complete, self-contained build specification for NutriDesh.**
> Follow every section in order. No additional prompting should be required until the product is live.

---

## 0. Project Identity

**App Name:** NutriDesh (নিউট্রিদেশ)
**Tagline:** আপনার পরিবারের পুষ্টি সঙ্গী — Your Family's Nutrition Companion
**Platform:** Mobile (iOS + Android via Expo React Native)
**Primary Language:** Bangla (বাংলা) — English as secondary toggle
**Target Market:** Bangladesh
**Total Stack Cost:** BDT 0 / USD 0 at hackathon and early beta scale

---

## 1. Design System — "Modern Bengali Wellness"

### 1.1 Design Philosophy

NutriDesh must feel:
- **Warm, calm, intelligent, human** — like advice from a trusted family nutritionist
- NOT clinical, NOT hospital-like, NOT generic SaaS, NOT Silicon Valley biohacker aesthetic
- Cultural reference: soft rice-paper textures, clay pot warmth, kitchen garden greens
- Inspiration mix: **30% Oura + 25% Headspace + 20% HealthifyMe + 15% Duolingo + 10% Spotify**

### 1.2 Color System

```
PRIMARY
  Forest Green:     #2E7D32   → CTA buttons, progress, safe foods, success states
  Light Green:      #4CAF50   → Secondary actions, active states

BACKGROUNDS
  Warm Cream:       #F8F5EF   → Main background (NOT pure white — warmer, premium feel)
  Card Surface:     #FFFFFF   → Card backgrounds with soft shadow
  Dark Background:  #121212   → Dark mode base (warm dark, not pure black)
  Dark Surface:     #1E1E1E   → Dark mode cards

ACCENT
  Turmeric Yellow:  #E6B325   → Warnings, nutrient alerts, achievement badges
  Clay Orange:      #D97B2D   → Calorie display, warmth, food cards
  Terracotta:       #C4704A   → Secondary CTAs, highlights (cultural clay pot reference)

SEMANTIC
  Safe Green:       #2E7D32   → Low GI, healthy foods
  Moderate Orange:  #FF9800   → Medium GI, moderate caution
  Alert Red:        #C94C4C   → High GI, diabetes warning, deficiency alert
  Soft Teal:        #00796B   → Pregnancy mode accent
  Playful Blue:     #1565C0   → Child mode accent

TEXT
  Primary Text:     #263238   → Headings, important body
  Secondary Text:   #455A64   → Subtitles, metadata
  Disabled:         #90A4AE   → Inactive elements
  On-Dark:          #F5F5F5   → Text on dark backgrounds
```

### 1.3 Typography

```
BANGLA TYPEFACE:   Hind Siliguri (Google Fonts) — ONLY this font for Bangla
  DO NOT USE: SolaimanLipi, Kalpurush, default Android Bangla
  Line Height: 1.6x for body (Bangla Matra needs breathing room)
  Min body size: 18sp for Bangla text (low-literacy accessibility)

ENGLISH TYPEFACE:  Inter (Google Fonts)
  Fallback: Roboto

TYPE SCALE:
  Display:    32sp Bold    → Screen titles
  H1:         28sp Bold    → Section headers
  H2:         24sp SemiBold→ Card titles
  H3:         20sp Medium  → Sub-sections
  Body:       18sp Regular → Main Bangla content (generous for readability)
  Caption:    14sp Regular → Metadata, timestamps
  Metric:     36sp Bold    → Numbers (calories, nutrients) — high visual weight
```

### 1.4 Shape & Spacing

```
BORDER RADIUS:
  Cards:        16dp
  Buttons:      12dp (squircle feel — approachable, not sharp)
  Chips/Tags:   20dp (fully rounded)
  FAB:          28dp

ELEVATION (React Native Paper):
  Level 1: 2dp  → Subtle card lift
  Level 2: 4dp  → Active cards
  Level 3: 8dp  → Modals, bottom sheets
  Level 4: 16dp → FAB

SPACING SYSTEM (8dp grid):
  xs: 4dp | sm: 8dp | md: 16dp | lg: 24dp | xl: 32dp | 2xl: 48dp

TOUCH TARGETS:
  Minimum: 48dp × 48dp (accessibility requirement)
  Preferred: 56dp × 56dp for primary actions
```

### 1.5 Motion & Microinteractions

```
ANIMATION LIBRARY: React Native Reanimated 2

KEY ANIMATIONS:
  Nutrition Ring:       Animated.timing, spring easing, 800ms fill on load
  FAB Press:            Scale 0.95 on press, spring back
  Scan Success:         Confetti burst (expo-confetti, lightweight)
  Meal Log Success:     Duolingo-style celebratory bounce + haptic feedback
  AI Typing Indicator:  3 bouncing dots (not spinner) — "পুষ্টি সহায়ক লিখছে..."
  Screen Transitions:   Smooth slide (React Navigation shared element)
  Bottom Sheet:         Spring animation slide-up
  Skeleton Loaders:     Shimmer effect on every loading state (no blank screens)
  Loading (Gemini):     Animated Bengali cooking pot with steam rising
                        (Lottie animation — use free Lottie from lottiefiles.com)

HAPTICS (expo-haptics):
  Success log:          Light impact
  Warning alert:        Medium impact
  Error:                Heavy impact
```

### 1.6 Icons

```
PRIMARY ICON SET: MaterialCommunityIcons (included in Expo)
CUSTOM ICONS (build as SVG components):
  - Rice bowl (bhat)
  - Fish (mach)
  - Lentils (dal)
  - Leafy greens (shak)
  - Bone → Calcium
  - Blood drop → Iron
  - Sun → Vitamin D / Vitamin A
  - Pregnant silhouette → Pregnancy mode
  - Child growth arrow → Child mode
  - Glucose meter → Diabetes mode
  - Mosque/moon → Ramadan mode
  - Market bag → Bazaar mode
```

---

## 2. Navigation Architecture

```
ROOT NAVIGATOR: Stack Navigator (React Navigation 6)

AUTH STACK:
  → SplashScreen
  → LanguageSelectScreen
  → OnboardingScreen (3 swipe screens)
  → ProfileWizardScreen (5 steps — skippable for basic mode)
  → LoginScreen (Phone OTP via Supabase)

MAIN TAB NAVIGATOR (Bottom Tabs — 4 tabs only):
  Tab 1: Home        → HomeScreen (icon: home-variant)
  Tab 2: Scan        → ScannerScreen (CENTER FAB — elevated, prominent)
  Tab 3: Chat        → ChatScreen (icon: chat-processing)
  Tab 4: Profile     → ProfileScreen (icon: account-circle)

  Center Scan button:
    - Elevated FAB style like Instagram "+" button
    - Forest green background, camera icon
    - Slightly above tab bar — most prominent element

STACK SCREENS (from tabs):
  From Home:
    → NutritionDetailScreen (single nutrient drill-down)
    → MealLogScreen (full meal history)
    → DeficiencyAlertScreen
    → RecommendationsScreen
    → WeeklyReportScreen (PDF export)
    → BudgetMealScreen
    → GroceryListScreen
    → WhatCanICookScreen
    → MoodEnergyScreen
    → RamadanModeScreen

  From Scan:
    → ScanResultScreen
    → FoodSearchScreen
    → VoiceLogScreen
    → BarcodeScanner Screen
    → MealPhotoHistoryScreen

  From Chat:
    → (full screen — no sub-routes)

  From Profile:
    → HealthProfileEditScreen
    → FamilyMembersScreen
    → ChildProfileScreen
    → DiabetesModeScreen
    → PregnancyModeScreen
    → ShasthoShebikaPortalScreen
    → SettingsScreen
    → NotificationPrefsScreen
    → ConsentAndPrivacyScreen
    → HealthGoalModeScreen
```

---

## 3. Technology Stack — 100% Free

### 3.1 Complete Stack

```
MOBILE FRONTEND:
  Framework:        Expo SDK 51 (React Native)
  UI Library:       React Native Paper 5.x (Material Design 3)
  Navigation:       React Navigation 6 (Stack + Bottom Tabs)
  State:            Redux Toolkit + RTK Query
  Animations:       React Native Reanimated 2
  Camera:           expo-camera
  Barcode:          expo-barcode-scanner
  Voice Input:      expo-speech (STT via device + Gemini)
  Voice Output:     expo-speech (TTS — reads nutrition aloud in Bangla)
  Haptics:          expo-haptics
  Notifications:    expo-notifications
  Local Storage:    WatermelonDB (SQLite offline-first)
  Charts:           react-native-chart-kit or Victory Native
  PDF Export:       expo-print + expo-sharing
  Image Compress:   expo-image-manipulator (compress to 800×800 max before upload)
  Lottie:           lottie-react-native (cooking pot loader, celebrations)
  Chat UI:          react-native-gifted-chat

BACKEND:
  Runtime:          Node.js 20 LTS
  Framework:        Express.js
  Hosting:          Render Free Tier (+ cron-job.org ping every 14min to prevent spin-down)
  Rate Limiting:    express-rate-limit (protect Gemini quota)
  Validation:       Joi or Zod
  Image Handling:   Sharp (resize/compress server-side backup)

AI ENGINE:
  Primary:          Google Gemini 1.5 Flash (via @google/generative-ai SDK)
  API Key:          From aistudio.google.com — FREE, no credit card
  Free Limits:      ~1,000 req/day, 15 RPM (treat as 10 RPM conservatively)
  Use Cases:        Food scan (vision), chat assistant, recommendations, deficiency prediction
  Fallback:         Local food DB rules for top 50 common dishes (no API needed)
  Caching:          Supabase cache table for Gemini responses (by food_name_en hash)

DATABASE & AUTH:
  Platform:         Supabase (Free: 500MB DB, 50K MAU, 1GB storage)
  Database:         PostgreSQL (managed by Supabase)
  Auth:             Supabase Auth — Phone OTP PRIMARY, Google OAuth secondary
  Storage:          Supabase Storage (food scan thumbnails, user avatars)
  RLS:              Row Level Security MUST be enabled on ALL tables from Day 1
  Edge Functions:   Supabase Edge Functions for lightweight tasks (avoid Render spin-down)
  Realtime:         Supabase Realtime for family dashboard sync

VERSION CONTROL:
  GitHub (free) — main/dev/feature branch strategy

DEPLOYMENT:
  Backend:          Render Free Tier (auto-deploy from GitHub main)
  App Demo:         Expo Go (QR code) for hackathon
  Production:       EAS Build (free tier) → Google Play Store ($25 one-time)
```

### 3.2 Rate Limit & Resilience Strategy

```
GEMINI RATE LIMIT HANDLING:
  1. Client-side request queue (Redux middleware)
     - Queue requests if RPM limit approaches
     - Show "পুষ্টি সহায়ক এখন ব্যস্ত — ১০ সেকেন্ড পরে আবার চেষ্টা করছি" with countdown
     - Never show raw API errors to user

  2. Response caching in Supabase (gemini_cache table):
     Schema: { food_name_en TEXT PRIMARY KEY, response JSONB, cached_at TIMESTAMP }
     - Before calling Gemini, check cache first
     - Cache hit: return instantly (zero tokens, zero latency)
     - Cache miss: call Gemini, store result
     - Cache TTL: 30 days (nutrition data doesn't change)
     - Pre-seed cache with top 50 BD dishes before hackathon demo

  3. Hybrid fallback mode:
     - For top 200 foods in WatermelonDB local cache:
       If recognized from device-side matching → serve local data instantly
       Skip Gemini entirely for these common items
     - Gemini only called for: uncertain IDs, compound plates, chat, new foods

  4. Image compression before upload:
     expo-image-manipulator → resize to max 800×800px, quality 0.7
     Reduces payload from ~3MB to ~150KB
     Add to ScannerScreen BEFORE base64 encoding

  5. Offline async queue:
     - User scans food offline → photo + metadata stored in WatermelonDB with status: 'pending'
     - NetInfo listener watches connectivity
     - On connection restore → auto-trigger Gemini scan → update meal log silently
     - Show "Syncing..." indicator in header
     - CRITICAL for rural Shastho Shebika use case
```

---

## 4. Database Schema — Complete SQL

```sql
-- Run this in Supabase SQL editor

-- USERS (managed by Supabase Auth)
-- auth.users table is auto-created by Supabase

-- HEALTH PROFILES
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary','light','moderate','active')),
  goal TEXT CHECK (goal IN ('lose','maintain','gain','medical')),
  conditions TEXT[] DEFAULT '{}',     -- ['diabetes','hypertension','pregnancy','anaemia']
  dietary_restrictions TEXT[] DEFAULT '{}',
  gestational_week INTEGER,           -- if pregnant
  calorie_target INTEGER,
  protein_target_g INTEGER,
  iron_target_mg DECIMAL(5,2),
  calcium_target_mg DECIMAL(5,2),
  folate_target_mcg DECIMAL(5,2),
  health_goal_mode TEXT,              -- 'student','gym','diabetic','pregnancy','elderly','child'
  is_household_manager BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- BANGLADESHI FOOD DATABASE
CREATE TABLE foods_bd (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn TEXT NOT NULL,              -- Bangla name
  name_en TEXT NOT NULL,              -- English name
  name_transliteration TEXT,          -- Romanized Bangla (e.g., "Shorshe Ilish")
  category TEXT NOT NULL,             -- 'fish','vegetable','rice','dal','meat','fruit','snack','packaged','street'
  subcategory TEXT,
  calories_per_100g DECIMAL(7,2),
  protein_g DECIMAL(7,2),
  carbs_g DECIMAL(7,2),
  fat_g DECIMAL(7,2),
  fiber_g DECIMAL(7,2),
  iron_mg DECIMAL(7,3),
  calcium_mg DECIMAL(7,2),
  vitamin_a_mcg DECIMAL(7,2),
  vitamin_c_mg DECIMAL(7,2),
  folate_mcg DECIMAL(7,2),
  vitamin_b12_mcg DECIMAL(7,3),
  vitamin_d_mcg DECIMAL(7,3),
  sodium_mg DECIMAL(7,2),             -- CRITICAL for hypertension/salt tracking
  potassium_mg DECIMAL(7,2),
  gi_index INTEGER,                   -- Glycemic Index (1-100)
  gi_category TEXT CHECK (gi_category IN ('low','medium','high')),
  is_cooked BOOLEAN DEFAULT false,
  raw_cooked_factor DECIMAL(4,2) DEFAULT 1.0,  -- yield/weight change factor
  common_allergens TEXT[] DEFAULT '{}',
  is_seasonal BOOLEAN DEFAULT false,
  season TEXT,                        -- 'winter','summer','monsoon','year-round'
  estimated_price_bdt_per_100g DECIMAL(7,2),   -- bazaar price estimate
  barcode TEXT,                       -- for packaged foods
  data_source TEXT,                   -- 'BIRDEM','FAO','USDA','manual'
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEAL LOGS
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods_bd(id),
  food_name_custom TEXT,              -- if not in DB
  meal_type TEXT CHECK (meal_type IN ('breakfast','lunch','dinner','snack','sehri','iftar')),
  portion_g DECIMAL(7,2),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  scan_method TEXT CHECK (scan_method IN ('camera','voice','manual','barcode','offline_sync')),
  scan_image_url TEXT,
  confidence_score DECIMAL(4,3),      -- Gemini confidence 0.0-1.0
  gemini_raw_response JSONB,          -- store raw for debugging
  is_offline_log BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ,
  family_member_id UUID,              -- null = logged for self
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GEMINI RESPONSE CACHE
CREATE TABLE gemini_cache (
  food_name_en TEXT PRIMARY KEY,
  food_name_bn TEXT,
  response JSONB NOT NULL,
  token_count INTEGER,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  hit_count INTEGER DEFAULT 0
);

-- GLUCOSE LOGS (Diabetes Mode)
CREATE TABLE glucose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_mmol DECIMAL(5,2) NOT NULL,
  reading_type TEXT CHECK (reading_type IN ('fasting','post_meal','random','bedtime')),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHILD PROFILES
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male','female')),
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAMILY MEMBERS
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_manager_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,                  -- 'spouse','child','parent','other'
  health_profile_id UUID REFERENCES health_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT HISTORY
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','model')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOOD / ENERGY LOGS
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT CHECK (mood IN ('energetic','normal','tired','weak','dizzy','unwell')),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER CORRECTIONS (feedback loop)
CREATE TABLE scan_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_gemini_food TEXT,
  corrected_food_id UUID REFERENCES foods_bd(id),
  corrected_food_name TEXT,
  scan_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNITY RECIPES
CREATE TABLE community_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES auth.users(id),
  name_bn TEXT NOT NULL,
  name_en TEXT,
  ingredients JSONB,                  -- [{food_id, quantity_g, name_bn}]
  instructions TEXT,
  is_diabetic_safe BOOLEAN DEFAULT false,
  is_pregnancy_safe BOOLEAN DEFAULT false,
  total_calories DECIMAL(7,2),
  is_approved BOOLEAN DEFAULT false,  -- moderation flag
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MARKET PRICES (crowd-sourced/admin maintained)
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id UUID REFERENCES foods_bd(id),
  price_bdt DECIMAL(7,2),
  unit TEXT,                          -- 'per_kg','per_piece','per_100g'
  location TEXT DEFAULT 'Dhaka',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFFLINE SCAN QUEUE
CREATE TABLE offline_scan_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_base64 TEXT NOT NULL,
  meal_type TEXT,
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'       -- 'pending','processing','completed','failed'
);

-- ROW LEVEL SECURITY — ENABLE ON ALL TABLES
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE glucose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_scan_queue ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users own their health profile"
  ON health_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their meal logs"
  ON meal_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their glucose logs"
  ON glucose_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their child profiles"
  ON child_profiles FOR ALL USING (auth.uid() = parent_user_id);

CREATE POLICY "Users own their family members"
  ON family_members FOR ALL USING (auth.uid() = household_manager_id);

CREATE POLICY "Users own their chat history"
  ON chat_history FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their mood logs"
  ON mood_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can read foods_bd"
  ON foods_bd FOR SELECT USING (true);

CREATE POLICY "Public can read community_recipes (approved only)"
  ON community_recipes FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can read market prices"
  ON market_prices FOR SELECT USING (true);

CREATE POLICY "Public can read gemini cache"
  ON gemini_cache FOR SELECT USING (true);
```

---

## 5. Backend API — Complete Endpoint Specification

### 5.1 Project Setup

```bash
mkdir nutridesh-backend && cd nutridesh-backend
npm init -y
npm install express cors dotenv @google/generative-ai @supabase/supabase-js \
  express-rate-limit helmet joi zod morgan compression
```

### 5.2 Environment Variables (.env)

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key_from_aistudio
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:19006,exp://your-expo-url
```

### 5.3 Server Entry (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security & middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(express.json({ limit: '10mb' })); // for base64 images
app.use(morgan('combined'));

// Global rate limiter — protect Gemini quota
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 requests per minute per IP
  message: { error: 'অনুরোধ বেশি হয়েছে। একটু পরে আবার চেষ্টা করুন।', retry_after: 60 }
});
app.use('/api/scan', globalLimiter);
app.use('/api/chat', globalLimiter);

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/profile',  require('./routes/profile'));
app.use('/api/scan',     require('./routes/scan'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/meals',    require('./routes/meals'));
app.use('/api/foods',    require('./routes/foods'));
app.use('/api/health',   require('./routes/health'));
app.use('/api/budget',   require('./routes/budget'));
app.use('/api/report',   require('./routes/report'));

// Keep-alive endpoint (for Render + cron-job.org)
app.get('/ping', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.listen(process.env.PORT || 3000, () =>
  console.log(`NutriDesh API running on port ${process.env.PORT || 3000}`)
);
```

### 5.4 Gemini Service (services/gemini.js)

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('./supabase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── FOOD SCAN ──────────────────────────────────────────────────
async function scanFood(imageBase64, mimeType = 'image/jpeg', userProfile) {
  // 1. Check Supabase cache first
  // (cache lookup happens at route level before calling this)

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `তুমি একজন বাংলাদেশি খাদ্য বিশেষজ্ঞ। এই ছবিতে কী খাবার বা উপাদান আছে বিশ্লেষণ করো।

শুধুমাত্র এই JSON ফরম্যাটে উত্তর দাও (অন্য কোনো টেক্সট নয়):
{
  "items": [
    {
      "food_name_bn": "বাংলা নাম",
      "food_name_en": "English name",
      "estimated_quantity_g": 150,
      "confidence": "high|medium|low",
      "is_cooked": true,
      "category": "fish|vegetable|rice|dal|meat|fruit|snack|other"
    }
  ],
  "plate_description_bn": "সংক্ষিপ্ত বর্ণনা"
}`;

  const result = await model.generateContent([
    { inlineData: { mimeType, data: imageBase64 } },
    prompt
  ]);

  const text = result.response.text();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── CHAT ASSISTANT ─────────────────────────────────────────────
async function chat(userMessage, userProfile, todayLog, chatHistory) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: buildSystemPrompt(userProfile, todayLog)
  });

  // Limit history to last 10 messages to avoid token bloat
  const limitedHistory = chatHistory.slice(-10).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const chatSession = model.startChat({ history: limitedHistory });
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
}

function buildSystemPrompt(profile, todayLog) {
  return `তুমি NutriDesh-এর পুষ্টি সহায়ক — একজন বিশ্বস্ত বাংলাদেশি পুষ্টিবিদ।

নিয়ম:
- সবসময় বাংলায় উত্তর দাও (ইংরেজিতে প্রশ্ন করলেও বাংলায় উত্তর)
- শুধু খাদ্য, পুষ্টি ও স্বাস্থ্য বিষয়ে কথা বলো
- কোনো রোগ নির্ণয় করবে না — প্রয়োজনে ডাক্তারের পরামর্শ নিতে বলো
- শুধু বাংলাদেশি খাবার সাজেস্ট করো
- সংক্ষিপ্ত, বাস্তবসম্মত ও উষ্ণ ভাষায় উত্তর দাও
- লম্বা তালিকা এড়িয়ে চলো — সর্বোচ্চ ৩টি পরামর্শ দাও

ব্যবহারকারীর তথ্য:
- নাম: ${profile.name || 'বন্ধু'}
- বয়স: ${profile.age} বছর | লিঙ্গ: ${profile.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
- ওজন: ${profile.weight_kg}কেজি | উচ্চতা: ${profile.height_cm}সেমি
- স্বাস্থ্য সমস্যা: ${profile.conditions?.join(', ') || 'কোনো বিশেষ সমস্যা নেই'}
- লক্ষ্য: ${profile.goal}
- দৈনিক ক্যালরি লক্ষ্য: ${profile.calorie_target} kcal

আজকের পুষ্টি গ্রহণ (এখন পর্যন্ত):
- ক্যালরি: ${todayLog.calories || 0}/${profile.calorie_target} kcal
- প্রোটিন: ${todayLog.protein_g || 0}গ্রাম/${profile.protein_target_g}গ্রাম
- আয়রন: ${todayLog.iron_mg || 0}মিগ্রা/${profile.iron_target_mg}মিগ্রা
- ক্যালসিয়াম: ${todayLog.calcium_mg || 0}মিগ্রা`;
}

// ── RECOMMENDATIONS ────────────────────────────────────────────
async function getRecommendations(userProfile, todayLog, budget = null) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const budgetClause = budget
    ? `বাজেট: আজকের বাকি খাবারের জন্য ${budget} টাকার মধ্যে।`
    : '';

  const prompt = `${buildSystemPrompt(userProfile, todayLog)}

${budgetClause}

আজকের বাকি খাবারের জন্য ৩টি পরামর্শ দাও। JSON ফরম্যাটে:
{
  "recommendations": [
    {
      "meal_name_bn": "খাবারের নাম",
      "reason_bn": "কেন খাবে",
      "estimated_calories": 300,
      "key_nutrients": ["প্রোটিন", "আয়রন"],
      "estimated_cost_bdt": 80,
      "is_diabetic_safe": true
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const clean = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── DEFICIENCY PREDICTION ──────────────────────────────────────
async function predictDeficiencies(userProfile, last7DaysLogs) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const avgNutrients = calculateAverages(last7DaysLogs);

  const prompt = `ব্যবহারকারীর গত ৭ দিনের গড় পুষ্টি গ্রহণ বিশ্লেষণ করো:
${JSON.stringify(avgNutrients)}

লক্ষ্য: ${JSON.stringify({ calories: userProfile.calorie_target, iron: userProfile.iron_target_mg })}

পুষ্টির ঘাটতির ঝুঁকি পূর্বাভাস দাও। JSON ফরম্যাটে:
{
  "predictions": [
    {
      "nutrient": "আয়রন",
      "risk_level": "high|medium|low",
      "days_until_deficiency": 7,
      "message_bn": "বার্তা",
      "suggested_foods_bn": ["খাবার ১", "খাবার ২"]
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const clean = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── WHAT CAN I COOK ────────────────────────────────────────────
async function whatCanICook(ingredientsList, userProfile) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const hasDiabetes = userProfile.conditions?.includes('diabetes');

  const prompt = `এই উপাদান দিয়ে কী রান্না করা যায়: ${ingredientsList.join(', ')}

${hasDiabetes ? 'ব্যবহারকারীর ডায়াবেটিস আছে — কম GI রেসিপি দাও।' : ''}

JSON ফরম্যাটে ৩টি রেসিপি দাও:
{
  "recipes": [
    {
      "name_bn": "রেসিপির নাম",
      "cooking_time_min": 20,
      "nutrition_score": 8,
      "is_diabetic_safe": true,
      "instructions_bn": "রান্নার পদ্ধতি",
      "estimated_calories": 250
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const clean = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { scanFood, chat, getRecommendations, predictDeficiencies, whatCanICook };
```

### 5.5 Key API Routes

```javascript
// routes/scan.js — POST /api/scan/food
router.post('/food', authMiddleware, async (req, res) => {
  const { imageBase64, mimeType, mealType } = req.body;

  // 1. Check Gemini cache
  // 2. Compress image (should be done on client — validate size)
  if (imageBase64.length > 2_000_000) {
    return res.status(413).json({ error: 'Image too large. Compress before upload.' });
  }

  try {
    const geminiResult = await geminiService.scanFood(imageBase64, mimeType, req.user.profile);

    // Cache each identified food
    for (const item of geminiResult.items) {
      await supabase.from('gemini_cache').upsert({
        food_name_en: item.food_name_en,
        food_name_bn: item.food_name_bn,
        response: item,
        cached_at: new Date().toISOString()
      }, { onConflict: 'food_name_en', ignoreDuplicates: false });
    }

    // Enrich with DB nutrition data
    const enriched = await enrichWithNutritionData(geminiResult.items);
    res.json({ success: true, items: enriched, description: geminiResult.plate_description_bn });

  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({
        error: 'অনুরোধ বেশি হয়েছে',
        message: 'একটু পরে আবার চেষ্টা করুন',
        retry_after: 15
      });
    }
    res.status(500).json({ error: 'স্ক্যান করা সম্ভব হয়নি' });
  }
});

// routes/chat.js — POST /api/chat
router.post('/', authMiddleware, async (req, res) => {
  const { message, saveToHistory = true } = req.body;
  const userId = req.user.id;

  // Sanitize input
  const cleanMessage = message.trim().slice(0, 1000); // max 1000 chars

  // Fetch context
  const [profile, todayLog, history] = await Promise.all([
    getUserProfile(userId),
    getTodayLog(userId),
    getChatHistory(userId, 10) // last 10 messages only
  ]);

  const response = await geminiService.chat(cleanMessage, profile, todayLog, history);

  // Save to history
  if (saveToHistory) {
    await supabase.from('chat_history').insert([
      { user_id: userId, role: 'user', content: cleanMessage },
      { user_id: userId, role: 'model', content: response }
    ]);
  }

  res.json({ response, timestamp: new Date().toISOString() });
});

// routes/budget.js — POST /api/budget/suggest
router.post('/suggest', authMiddleware, async (req, res) => {
  const { budget_bdt, meal_type } = req.body;
  const profile = await getUserProfile(req.user.id);
  const todayLog = await getTodayLog(req.user.id);

  const suggestions = await geminiService.getRecommendations(profile, todayLog, budget_bdt);

  // Enrich with market prices from DB
  const enriched = await enrichWithPrices(suggestions.recommendations);
  res.json({ suggestions: enriched, budget_bdt });
});
```

---

## 6. Expo App — Complete File Structure

```
nutridesh-app/
├── App.js
├── app.json
├── package.json
├── assets/
│   ├── images/
│   │   ├── splash.png
│   │   ├── icon.png
│   │   └── onboarding/
│   └── animations/
│       ├── cooking-pot.json     (Lottie)
│       └── confetti.json        (Lottie)
├── src/
│   ├── constants/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── strings.js           (all Bangla UI strings)
│   ├── theme/
│   │   ├── lightTheme.js
│   │   └── darkTheme.js
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainTabNavigator.js
│   ├── store/
│   │   ├── index.js             (Redux store)
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── profileSlice.js
│   │   │   ├── mealLogSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── uiSlice.js
│   │   └── middleware/
│   │       └── requestQueue.js  (Gemini rate limit queue)
│   ├── services/
│   │   ├── supabase.js
│   │   ├── api.js               (backend API calls)
│   │   └── watermelon.js        (offline DB)
│   ├── components/
│   │   ├── common/
│   │   │   ├── NutritionRing.jsx
│   │   │   ├── MacroPill.jsx
│   │   │   ├── NutrientIcon.jsx  (bone/drop/sun icons)
│   │   │   ├── GITrafficLight.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── OfflineBanner.jsx
│   │   │   ├── LottieLoader.jsx  (cooking pot animation)
│   │   │   └── DeficiencyAlert.jsx
│   │   ├── chat/
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── QuickReplyChips.jsx
│   │   │   └── AssistantAvatar.jsx
│   │   └── scan/
│   │       ├── ScanOverlay.jsx
│   │       └── NutritionCard.jsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── LanguageSelectScreen.jsx
│   │   │   ├── OnboardingScreen.jsx
│   │   │   ├── ProfileWizardScreen.jsx
│   │   │   └── LoginScreen.jsx
│   │   ├── home/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── NutritionDetailScreen.jsx
│   │   │   ├── RecommendationsScreen.jsx
│   │   │   ├── BudgetMealScreen.jsx
│   │   │   ├── GroceryListScreen.jsx
│   │   │   ├── WhatCanICookScreen.jsx
│   │   │   ├── MoodEnergyScreen.jsx
│   │   │   ├── WeeklyReportScreen.jsx
│   │   │   └── RamadanModeScreen.jsx
│   │   ├── scan/
│   │   │   ├── ScannerScreen.jsx
│   │   │   ├── ScanResultScreen.jsx
│   │   │   ├── FoodSearchScreen.jsx
│   │   │   ├── BarcodeScanner Screen.jsx
│   │   │   ├── MealPhotoHistoryScreen.jsx
│   │   │   └── VoiceLogScreen.jsx
│   │   ├── chat/
│   │   │   └── ChatScreen.jsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.jsx
│   │   │   ├── HealthProfileEditScreen.jsx
│   │   │   ├── FamilyDashboardScreen.jsx
│   │   │   ├── ChildProfileScreen.jsx
│   │   │   ├── DiabetesModeScreen.jsx
│   │   │   ├── PregnancyModeScreen.jsx
│   │   │   ├── ShasthoShebikaPortalScreen.jsx
│   │   │   ├── HealthGoalModeScreen.jsx
│   │   │   ├── SettingsScreen.jsx
│   │   │   └── ConsentScreen.jsx
│   │   └── shared/
│   │       └── ErrorScreen.jsx
│   ├── hooks/
│   │   ├── useNutritionGoals.js
│   │   ├── useOfflineSync.js
│   │   └── useGeminiQueue.js
│   └── utils/
│       ├── nutritionCalculator.js
│       ├── imageCompressor.js
│       └── banglaNumbers.js      (convert numerals to Bangla)
```

---

## 7. Screen-by-Screen UI Specification

### 7.1 SplashScreen

```
Background: Warm cream #F8F5EF
Center: NutriDesh logo (green) + নিউট্রিদেশ text (Hind Siliguri)
Below: Tagline "আপনার পরিবারের পুষ্টি সঙ্গী"
Animation: Logo fades in, then tagline slides up
Duration: 2 seconds then auto-navigate
```

### 7.2 OnboardingScreen (3 swipe screens)

```
Screen 1 — The Problem:
  Full-screen illustration: Bangladeshi family at dinner table
  Headline: "বাংলাদেশের পুষ্টি সংকট"
  Subtext: "২৪% শিশু পুষ্টিহীন। ৩৫% নারী অতিরিক্ত ওজনে ভুগছেন।"

Screen 2 — The Solution:
  Illustration: Phone scanning a plate of dal-bhat-mach
  Headline: "NutriDesh এখন আপনার সাথে"
  Subtext: "বাংলাদেশি খাবার বোঝে। বাংলায় কথা বলে।"

Screen 3 — Free Promise:
  Illustration: Green shield with BDT 0 symbol
  Headline: "সম্পূর্ণ বিনামূল্যে"
  Subtext: "কোনো সাবস্ক্রিপশন নেই। শুধু আপনার স্বাস্থ্য।"

Bottom: Skip button + Next/Get Started button (green)
Language toggle: Top right corner (বাংলা / EN)
Progress dots: 3 dots indicator
```

### 7.3 ProfileWizardScreen (5 steps)

```
Step 1 — Basic Info:
  "আপনার নাম কী?" → TextInput (large, Bangla keyboard)
  Age selector (scrollable drum picker)
  Gender selector (3 large rounded chips: পুরুষ / মহিলা / অন্য)

Step 2 — Body Measurements:
  Height slider (140cm - 200cm) with visual indicator
  Weight input (kg) with BMI preview

Step 3 — Health Goals:
  4 large icon cards:
  🏃 ওজন কমাতে চাই | ⚖️ ওজন ঠিক রাখতে চাই
  💪 ওজন বাড়াতে চাই | 🏥 স্বাস্থ্য সমস্যা আছে

Step 4 — Health Conditions (multi-select chips):
  ডায়াবেটিস | উচ্চ রক্তচাপ | গর্ভাবস্থা | রক্তশূন্যতা
  শিশুর যত্ন | রমজান মোড | কিছু নেই

Step 5 — Health Goal Mode:
  6 mode cards with icons:
  👨‍🎓 ছাত্র ফিটনেস | 💪 জিম / মাসেল গেইন
  🩺 ডায়াবেটিক কেয়ার | 🤱 গর্ভাবস্থা
  👴 বয়স্ক পুষ্টি | 👶 শিশু বৃদ্ধি

Progress bar at top (step 1/5)
Back button | Skip button (right) | Next button (green)
```

### 7.4 HomeScreen (Most Important)

```
LAYOUT (top to bottom):

1. TOP HEADER (56dp height):
   Left: Greeting "সুপ্রভাত, [Name] 🌿"
   Right: Streak counter (flame icon + number)
   Background: Warm cream

2. HEALTH MODE INDICATOR (if active):
   Pill chip showing active mode:
   🟡 ডায়াবেটিস মোড | 🩵 গর্ভাবস্থা মোড | 🔵 শিশু মোড
   Tappable → mode-specific screen

3. AI INSIGHT CARD (signature feature):
   Rounded card, Forest Green gradient left border
   Icon + "আজকের পুষ্টি পরামর্শ"
   Dynamic text: "গত ৩ দিন আপনার আয়রন কম — আজ পুঁই শাক বা ছোট মাছ খান।"
   Powered by deficiency prediction + Gemini

4. HERO NUTRITION RING:
   Large centered ring (120dp diameter)
   Animated fill on screen load (Reanimated)
   Center: remaining calories (bold, large, Clay Orange)
   Below ring: "১৮০০ এর মধ্যে ১১০০ kcal"
   3 macro pills below: Protein | Carbs | Fat
   Color coded progress

5. MICRONUTRIENT SCROLLABLE ROW:
   Horizontal scroll chips (each 80dp wide):
   [🦴 ক্যালসিয়াম 45%] [💧 আয়রন 32%] [☀️ ভিটামিন A 78%] [🌿 ফোলেট 55%]
   Red background chip if under 40%

6. TODAY'S MEALS TIMELINE:
   Label: "আজকের খাবার"
   Vertical cards:
   🌅 সকাল — রুটি + ডিম (৩৮০ kcal)
   ☀️ দুপুর — ভাত + ডাল + মাছ (৬২০ kcal)
   🌙 রাত — (লগ করুন)
   Each card: food thumbnail (if scanned) + name + calories + time

7. DEFICIENCY ALERT (if triggered):
   Soft red card with alert icon
   "আপনার আয়রন ৩ দিন ধরে কম। আজ শাক-সবজি বাড়ান।"
   Tap → DeficiencyAlertScreen

8. QUICK ACTIONS ROW:
   4 rounded icon pills:
   📷 স্ক্যান | 💬 AI সহায়ক | 💰 বাজেট মিল | 🥘 কী রান্না করব?

9. SEASONAL FOOD CARD:
   "এই সময়ের সেরা খাবার 🌿"
   Horizontal scroll of seasonal BD foods with prices

10. FLOATING ACTION BUTTON:
    Center bottom, elevated above tab bar
    Forest green, camera icon
    Label: "খাবার স্ক্যান করুন"
    Pulsing subtle animation to draw attention
```

### 7.5 ScannerScreen

```
LAYOUT:
  Full-screen Expo Camera
  
  TOP BAR (semi-transparent dark overlay):
    Back arrow | "খাবার স্ক্যান" | Flash toggle | Gallery icon
  
  CAMERA OVERLAY:
    Rounded rectangle guide frame: "প্লেটটি ফ্রেমে রাখুন"
    Subtle corner indicators (4 green corner marks)
    
  SCANNING ANIMATION (while Gemini processes):
    Lottie cooking pot animation (bottom center)
    "বিশ্লেষণ করা হচ্ছে..."
    
  BOTTOM CONTROLS:
    Left: Gallery import button (rounded, semi-transparent)
    Center: Large circular shutter button (white, 72dp)
    Right: Voice input button (mic icon)
    
  TOP PILL (context):
    "সকাল | দুপুর | রাত | স্ন্যাক" — tappable meal type selector
    
SCAN RESULT BOTTOM SHEET (slides up after detection):
  Step 1: Food photo (cropped, rounded corners)
  Step 2: Identified items as editable cards:
    Each card: food icon + "শোল মাছ — ২০০গ্রাম" + confidence badge
    Confidence: ✅ নিশ্চিত | ⚠️ সম্ভব | ❓ অনিশ্চিত
    Edit button on each card
  Step 3: Portion selector (S/M/L/Custom chips)
  Step 4: Nutrition summary (calories + key macros)
  Step 5: GI Traffic Light (if diabetes mode active)
  CTA: Large green "লগ করুন" button
  Secondary: "সঠিক নয়? এডিট করুন" link
```

### 7.6 ChatScreen (পুষ্টি সহায়ক)

```
LAYOUT:
  TOP BAR:
    Assistant avatar (small illustrated Bangladeshi nutritionist character)
    "পুষ্টি সহায়ক"
    Online indicator (green dot)
    
  QUICK REPLY CHIPS (only when chat is empty):
    Horizontal scroll:
    "আজ কী খাব?" | "ডায়াবেটিসে ইলিশ খাওয়া যাবে?" | "Protein কম কেন?" 
    "রমজানে কী খাব?" | "বাজেট মিল suggest করো" | "শিশুর খাবার"
    
  CHAT AREA (react-native-gifted-chat):
    User bubbles: Forest Green (#2E7D32), right, white text
    AI bubbles: Warm Cream (#F8F5EF), left, dark text, green border
    Bubble corner radius: 16dp (squircle feel)
    
    AI Typing Indicator:
    "পুষ্টি সহায়ক লিখছে" + 3 bouncing dots (Reanimated)
    
  BOTTOM INPUT:
    TextInput: "বাংলায় লিখুন বা বলুন..."
    Left: Mic button (prominent, green) — press to speak
    Right: Send button (arrow, green)
    Voice active state: Mic turns red, "শুনছি..." label
    
  VOICE OUTPUT:
    Speaker icon next to each AI bubble
    Tap to read aloud via expo-speech (Bangla TTS)
    
  ASSISTANT AVATAR DESIGN:
    Simple illustrated character: friendly face, wearing traditional attire
    NOT a robot — warm, human, Bengali
    This becomes NutriDesh brand mascot
```

### 7.7 DiabetesModeScreen

```
ACCENT COLOR: Amber/Yellow (#E6B325)

SECTIONS:
  1. Today's GI Summary:
     Gauge chart: Low | Medium | High
     Today's average glycemic load score
     
  2. Glucose Log:
     "+ লগ করুন" button → quick input (mmol + reading type)
     Past 7 days readings as small line chart
     Correlation tip: "গতকাল বিরিয়ানির পর রিডিং বেশি ছিল"
     
  3. Today's Meals GI Breakdown:
     Each meal card: food name + GI badge (Green/Yellow/Red)
     
  4. Safe Foods Today:
     Horizontal scroll of green-tagged safe BD foods
     
  5. Sodium Alert (if intake > 1500mg):
     Red salt shaker icon + "আজ লবণ বেশি হয়েছে" warning
     
  6. Share with Doctor:
     "রিপোর্ট তৈরি করুন" → PDF via expo-print
     QR code option for Shastho Shebika
```

### 7.8 RamadanModeScreen

```
ACCENT: Golden crescent moon + warm amber

SECTIONS:
  1. Today's Fasting Status:
     Sehri time | Iftar time (city-based)
     Countdown to Iftar
     
  2. Sehri Recommendations:
     "সেহরিতে কী খাবেন" — slow-release energy foods
     Diabetic-safe sehri options if diabetes mode active
     
  3. Iftar Recommendations:
     "ইফতারে কী খাবেন" — hydration + balanced nutrients
     Warning: "খেজুরের পর মিষ্টি না খাওয়াই ভালো (ডায়াবেটিস)"
     
  4. Hydration Tracker:
     Water intake between Iftar and Sehri
     Goal: 8 glasses
     
  5. Fasting Nutrition Balance:
     Did today's Sehri + Iftar meet daily targets?
     Compact ring showing % of daily needs met
```

### 7.9 BudgetMealScreen

```
HEADER: "বাজেটের মধ্যে পুষ্টিকর খাবার"

INPUT:
  "আজকের বাজেট কত?" → Number input with ৳ prefix
  Large chips: ৳50 | ৳100 | ৳150 | ৳200 | কাস্টম
  Mode toggle: ব্যক্তিগত | পরিবার | ছাত্র মোড

RESULTS:
  3 meal suggestion cards:
  Each: food photo + name + nutrition score + estimated cost
  Color coded: Green (within budget) / Yellow (slightly over)
  
MARKET PRICE TABLE:
  Food | Protein | Estimated Price
  ডিম | High | ৳১২ প্রতিটি
  রুই মাছ | Medium | ৳৩২০/কেজি
  মুসুর ডাল | High | ৳৮০/কেজি
  
GROCERY LIST GENERATOR:
  "শপিং লিস্ট তৈরি করুন" → grouped by bazaar section
  Total estimated cost shown
  Share via WhatsApp button
```

### 7.10 ShasthoShebikaPortalScreen

```
ACCESS: Password-protected simple PIN entry
ACCENT: Professional teal

FEATURES:
  1. Family List:
     Add/view multiple households
     Each: family name + last visit date + nutrition risk color
     
  2. Quick Assessment:
     Child: Name + age + weight → stunting risk indicator
     Pregnant: Week + weight → deficiency alert
     
  3. Report Generation:
     Select family → generate text report (SMS-length)
     OR generate QR code (user scans to share their data)
     Low-bandwidth mode: plain text summary only
     
  4. Share Report:
     WhatsApp share (text format)
     QR code to share nutrition profile
     PDF for clinic records
```

---

## 8. WatermelonDB Schema (Offline)

```javascript
// database/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'foods_local',
      columns: [
        { name: 'food_id', type: 'string' },
        { name: 'name_bn', type: 'string' },
        { name: 'name_en', type: 'string' },
        { name: 'calories_per_100g', type: 'number' },
        { name: 'protein_g', type: 'number' },
        { name: 'iron_mg', type: 'number' },
        { name: 'calcium_mg', type: 'number' },
        { name: 'gi_index', type: 'number' },
        { name: 'gi_category', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'image_url', type: 'string', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'meal_logs_local',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string' },
        { name: 'food_name', type: 'string' },
        { name: 'food_id', type: 'string', isOptional: true },
        { name: 'portion_g', type: 'number' },
        { name: 'meal_type', type: 'string' },
        { name: 'logged_at', type: 'number' }, // timestamp
        { name: 'sync_status', type: 'string' }, // 'synced','pending','failed'
        { name: 'scan_image_base64', type: 'string', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'offline_scan_queue',
      columns: [
        { name: 'image_base64', type: 'string' },
        { name: 'meal_type', type: 'string' },
        { name: 'queued_at', type: 'number' },
        { name: 'status', type: 'string' },
      ]
    }),
  ]
});
```

---

## 9. Redux Store Structure

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import mealLogReducer from './slices/mealLogSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import { requestQueueMiddleware } from './middleware/requestQueue';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    mealLog: mealLogReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(requestQueueMiddleware),
});

// requestQueue middleware — handles Gemini rate limiting
// If API returns 429, queues request and retries after 15s
// Shows countdown UI via uiSlice
```

---

## 10. Key Bangla UI Strings (strings.js)

```javascript
export const STRINGS = {
  // Greetings
  GOOD_MORNING: 'সুপ্রভাত',
  GOOD_AFTERNOON: 'শুভ দুপুর',
  GOOD_EVENING: 'শুভ সন্ধ্যা',

  // Meal types
  BREAKFAST: 'সকালের নাস্তা',
  LUNCH: 'দুপুরের খাবার',
  DINNER: 'রাতের খাবার',
  SNACK: 'স্ন্যাক',
  SEHRI: 'সেহরি',
  IFTAR: 'ইফতার',

  // Nutrients
  CALORIES: 'ক্যালরি',
  PROTEIN: 'প্রোটিন',
  CARBS: 'কার্বোহাইড্রেট',
  FAT: 'চর্বি',
  IRON: 'আয়রন',
  CALCIUM: 'ক্যালসিয়াম',
  VITAMIN_A: 'ভিটামিন এ',
  FOLATE: 'ফোলেট',
  SODIUM: 'সোডিয়াম (লবণ)',

  // Chat prompts
  CHAT_PLACEHOLDER: 'বাংলায় লিখুন বা বলুন...',
  CHAT_THINKING: 'পুষ্টি সহায়ক লিখছে',
  QUICK_REPLY_1: 'আজ কী খাব?',
  QUICK_REPLY_2: 'ডায়াবেটিসে ইলিশ খাওয়া যাবে?',
  QUICK_REPLY_3: 'Protein কম কেন?',
  QUICK_REPLY_4: 'বাজেট মিল suggest করো',
  QUICK_REPLY_5: 'রমজানে কী খাব?',

  // Alerts
  IRON_LOW: 'আয়রন কম — আজ শাক-সবজি বাড়ান',
  RATE_LIMIT: 'অনুরোধ বেশি হয়েছে। {{seconds}} সেকেন্ড পরে আবার চেষ্টা করছি...',
  OFFLINE_MODE: 'অফলাইন মোড — লোকাল ডাটাবেস',
  SYNC_PENDING: 'সংযোগ পেলে সিঙ্ক হবে',

  // Scanner
  SCAN_PROMPT: 'প্লেটটি ফ্রেমে রাখুন',
  ANALYZING: 'বিশ্লেষণ করা হচ্ছে...',
  SCAN_CORRECTION: 'সঠিক নয়? এডিট করুন',
  LOG_MEAL: 'লগ করুন',
};
```

---

## 11. Bangladeshi Food Database Seed Data

```
Pre-hackathon: Member 4 must populate foods_bd table with minimum 150 items.

PRIORITY ORDER FOR DATA ENTRY:
1. Top 30 most-eaten cooked dishes (dal, bhat, tarkari, mach dishes)
2. Top 40 raw vegetables (all common shobji)
3. Top 20 freshwater fish (rui, katla, ilish, shol, etc.)
4. Top 15 dal varieties
5. Top 20 fruits (deshi fruits)
6. Top 10 eggs/meat/poultry
7. Top 15 street foods

DATA SOURCES (in priority order):
1. FAO Bangladesh Food Composition Table (primary — most authoritative)
2. BIRDEM Dietary Guidelines for Bangladesh
3. FoodBD Dataset (3,523 annotated BD meal images — for image testing)
4. icddr,b nutrition publications
5. USDA FoodData Central (for items with BD equivalents)

REQUIRED FIELDS PER ITEM (minimum):
- name_bn, name_en, category, calories_per_100g
- protein_g, carbs_g, fat_g
- iron_mg, calcium_mg, vitamin_a_mcg, folate_mcg
- sodium_mg (CRITICAL — for hypertension/salt tracking)
- gi_index + gi_category (for diabetes mode)
- estimated_price_bdt_per_100g (for budget features)
- season (for seasonal recommendations)

CRITICAL ITEMS TO INCLUDE (with nutritional focus):
- Ilish mach (hilsa) — omega-3, national fish
- Pui shak — highest iron among BD leafy greens
- Shutki (dried fish) — calcium + protein
- Karola (bitter gourd) — diabetes management
- Lal shak (red amaranth) — iron + folate
- Dhonia pata (coriander) — micronutrients
- Sajne data (drumstick) — calcium + vitamins
- Kachur loti (taro stem) — iron
- All dal varieties (musur, moong, chana, maskalai)
```

---

## 12. Deployment Guide

### 12.1 Backend (Render)

```bash
# 1. Push to GitHub
git add . && git commit -m "NutriDesh backend" && git push origin main

# 2. Render.com setup:
#    New Web Service → Connect GitHub → Select repo
#    Build Command: npm install
#    Start Command: node server.js
#    Environment Variables: add all from .env
#    Free instance type selected

# 3. Set up keep-alive ping:
#    Go to cron-job.org (free)
#    Create job: GET https://nutridesh.onrender.com/ping
#    Schedule: Every 14 minutes
#    This prevents Render free tier from spinning down
```

### 12.2 Supabase

```bash
# 1. Create project at supabase.com (free tier)
# 2. Run the complete SQL schema from Section 4
# 3. Enable RLS on all tables (SQL already included in schema)
# 4. Set up Supabase Auth:
#    Authentication → Providers → Phone (enable Twilio for OTP)
#    OR use email OTP (simpler, no Twilio needed for hackathon)
# 5. Create storage bucket: 'food-scans' (public read)
# 6. Copy SUPABASE_URL and SUPABASE_SERVICE_KEY to Render env vars
```

### 12.3 Expo App

```bash
# 1. Install dependencies
npx create-expo-app nutridesh-app
cd nutridesh-app
npx expo install expo-camera expo-barcode-scanner expo-speech \
  expo-haptics expo-notifications expo-image-manipulator \
  expo-print expo-sharing
npm install @supabase/supabase-js @google/generative-ai \
  @reduxjs/toolkit react-redux react-native-gifted-chat \
  @nozbe/watermelondb lottie-react-native react-native-paper \
  @react-navigation/native @react-navigation/bottom-tabs \
  @react-navigation/stack react-native-reanimated

# 2. Start development
npx expo start
# Scan QR code with Expo Go app on Android/iOS

# 3. For production build (post-hackathon):
npx eas build --platform android --profile preview
```

---

## 13. Pre-Hackathon Checklist

```
Member 1 (Lead/Frontend):
  [ ] Expo project initialized with all dependencies
  [ ] Navigation structure set up (auth stack + main tabs)
  [ ] Design system file created (colors, typography, spacing)
  [ ] HomeScreen skeleton built

Member 2 (AI Engineer):
  [ ] Gemini API key obtained from aistudio.google.com
  [ ] Food scan prompt tested with 10+ BD food photos
  [ ] Chat system prompt tested in Bangla
  [ ] JSON response parsing verified
  [ ] Cache-check logic implemented

Member 3 (Backend):
  [ ] Supabase project created + schema deployed
  [ ] RLS policies confirmed active
  [ ] Render deployment live + ping job active
  [ ] /api/scan/food endpoint tested
  [ ] /api/chat endpoint tested

Member 4 (Data):
  [ ] 50 foods seeded in foods_bd (minimum before hackathon starts)
  [ ] 150 foods target by end of Day 1
  [ ] GI index verified for all carb-heavy foods
  [ ] Sodium values entered for all foods
  [ ] Gemini cache pre-seeded with top 30 dish responses
  [ ] 10 test meal photos collected for demo

Member 5 (Design/Pitch):
  [ ] Figma screens for key flows (Home, Scan, Chat)
  [ ] Demo account pre-populated (3 days of meal history)
  [ ] Backup screenshots/screen recordings ready
  [ ] 3-minute pitch script rehearsed
  [ ] Judge Q&A prep: 10 likely questions + answers
  [ ] Consent + privacy screen content written in Bangla
```

---

## 14. Demo Flow (3-Minute Script)

```
[0:00-0:20] HOOK
"Bangladesh has a nutrition crisis — 24% of children are stunted,
diabetes affects 1 in 9 adults. Yet no app exists that understands
Bangladeshi food or speaks Bangla. This is NutriDesh."

[0:20-0:40] HOME DASHBOARD
Show: Personalized greeting + AI insight card + nutrition ring
Say: "NutriDesh knows who you are — your health conditions,
what you've eaten today, and what your body needs right now."

[0:40-1:15] FOOD SCANNER (demo moment)
Action: Scan a pre-prepared plate (dal-bhat-ilish)
Say: "Point the camera at any Bangladeshi meal — raw or cooked.
NutriDesh identifies every component using Gemini AI,
calculates the nutrition, and logs it in seconds."
Show: Scan result with GI traffic light (diabetes mode active)

[1:15-1:50] AI CHAT (wow moment)
Action: Type/speak "আমি ডায়াবেটিক, বিরিয়ানি খেয়েছি, এখন কী খাব?"
Say: "পুষ্টি সহায়ক — our AI nutrition assistant — knows
your health profile and today's meals. Watch this response."
Show: Personalized Bangla response in 3 seconds

[1:50-2:15] BUDGET MEAL FEATURE
Action: Enter ৳150 budget
Say: "Bangladesh is price-sensitive. NutriDesh suggests
high-nutrition meals within your budget using current bazaar prices."

[2:15-2:35] DEFICIENCY PREDICTION
Show: "Your iron trend suggests deficiency risk in 7 days"
Say: "We don't just track — we predict. Proactive nutrition
intelligence before problems develop."

[2:35-3:00] CLOSE
Say: "NutriDesh is built entirely on free technology —
zero cost to build, zero cost to use. One API, one database,
one mission: bring nutrition intelligence to every Bangladeshi
household, in their language, with their food."
Show: App logo + "Built for Bangladesh"
```

---

## 15. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini daily quota exceeded (~1000 req/day) | Cache pre-seeded; hybrid local fallback; rate limit queue |
| Gemini misidentifies BD cuisine | Pre-load 30 test images; user correction flow; confidence badge |
| Render spins down during demo | cron-job.org ping every 14 min; Supabase Edge as backup |
| Low-light food photo quality | Client-side enhancement hint; manual search fallback |
| No internet at demo venue | WatermelonDB offline cache; pre-populated demo account |
| Bangla text rendering on low-end Android | Test Hind Siliguri on real device pre-hackathon |
| Data accuracy liability | Disclaimer: "NutriDesh is not a medical device. Consult a doctor." |
| Supabase connection limits | Connection pooling enabled by default in Supabase |

---

*NutriDesh — Built for Bangladesh. Powered by AI. Costs Nothing.*
*CloudCamp Bangladesh Hackathon 2026 | Healthcare Domain*
