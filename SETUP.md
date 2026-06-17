# NutriDesh Setup

## 1. Get free Gemini API key (60 seconds)

1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click **Create API Key** → copy
4. Paste into `nutridesh-backend/.env`:

```
GEMINI_API_KEY=AIzaSy_your_actual_key_here
```

## 2. Find your Mac's LAN IP (for real phone testing)

```bash
ipconfig getifaddr en0
# example output: 192.168.1.50
```

Edit `nutridesh-app/.env`:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
```

(Skip if testing only in iOS simulator or web — `localhost` works there.)

## 3. Start backend

```bash
cd nutridesh-backend
npm start
```

Output should show:
```
🌿 NutriDesh API running on http://localhost:3000
   Gemini mode: LIVE
```

If it says `MOCK` — key not loaded. Check `.env` file path.

## 4. Start app

```bash
cd nutridesh-app
npx expo start
```

## 5. Open on phone

- Install **Expo Go** from App Store / Play Store
- Phone + Mac on same WiFi
- iOS: Camera app → scan terminal QR → tap notification
- Android: Expo Go → "Scan QR Code"

## Verify Gemini live

1. Open app → tap chat tab
2. Type: "আজ কী খাব?"
3. Response should be context-aware Gemini reply (not the canned mock text)

If still hitting mock fallback, check Mac terminal — likely backend unreachable from phone. Either:
- Use `npx expo start --tunnel` (slower but works across networks)
- Or check firewall allows port 3000

## Data persistence

Profile, meals, glucose, mood, chat history — all auto-save to AsyncStorage. Survive app restart. Reset with Profile → Settings → Cache Clear (or delete + reinstall).

## Reset demo data

Delete app → reinstall via Expo Go. Wizard re-runs.
