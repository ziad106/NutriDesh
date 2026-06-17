# Deploy NutriDesh to share with friends

## TL;DR

1. **Backend** → Render free tier (5 min setup)
2. **App** → Expo Go link OR APK file

---

## PATH A: Render backend + Expo Go link (recommended, both iOS+Android)

### A1. Rotate Gemini key first (security)

Go to https://aistudio.google.com/apikey → delete current key → create new one. Save it.

### A2. Push backend to GitHub

```bash
cd nutridesh-backend
git init && git add . && git commit -m "deploy"
# Create empty repo at github.com/new
git remote add origin https://github.com/YOUR/nutridesh-backend.git
git push -u origin main
```

### A3. Render deploy

1. https://render.com → sign up (free)
2. New + → Web Service → connect repo
3. Build: `npm install` | Start: `node server.js` | Instance: **Free**
4. Env vars:
   - `GEMINI_API_KEY` = your new key
   - `ALLOWED_ORIGINS` = `*`
   - `NODE_ENV` = `production`
5. Create

Wait 3-5 min. URL: `https://nutridesh-api.onrender.com`. Verify by opening URL.

### A4. Keep alive (free tier sleeps after 15 min idle)

https://cron-job.org → GET `https://nutridesh-api.onrender.com/ping` every 14 min.

### A5. Update app .env

```bash
cd ../nutridesh-app
# Edit .env:
# EXPO_PUBLIC_API_URL=https://nutridesh-api.onrender.com
```

### A6. Publish to Expo

```bash
npm install -g eas-cli
eas login                       # create free Expo account
eas init                        # accept defaults
eas update:configure
eas update --branch preview --message "first publish"
```

Copy the share URL from output.

### A7. Friend's side

1. Install **Expo Go** (App Store / Play Store)
2. Tap your share URL
3. App loads in Expo Go

Friend needs internet. No WiFi sharing with you needed.

---

## PATH B: APK file (Android only, no Expo Go needed)

Friend just installs normal Android app.

### B1. Do A1-A5 first (backend on Render, .env updated)

### B2. Build APK

```bash
cd nutridesh-app
eas login
eas build --profile preview --platform android
```

Wait 10-15 min. EAS gives download URL.

### B3. Share

Send friend the APK URL via WhatsApp/Drive.

### B4. Friend installs

1. Download APK on Android phone
2. Settings → Security → allow install from unknown sources
3. Tap APK → install → open

Done. No Expo Go. No accounts.

iOS needs $99/yr Apple Developer account — skip unless required.

---

## Updates after first deploy

### Backend changes

```bash
cd nutridesh-backend
git add . && git commit -m "fix"
git push origin main
```

Render auto-deploys in 2 min.

### App changes (JS-only)

```bash
cd nutridesh-app
eas update --branch preview --message "update"
```

Friend's app picks up new code on next launch (no reinstall).

### App changes (native config like permissions)

```bash
eas build --profile preview --platform android   # rebuild APK
```

Send new APK to friend.

---

## Costs

| Service | Free tier | Limit |
|---|---|---|
| Render | Free forever | 750 hrs/mo, sleeps after idle |
| cron-job.org | Free forever | unlimited 1-min jobs |
| Expo | Free | 30 EAS builds/mo, unlimited updates |
| Gemini API | Free | ~1500 req/day, 15 req/min |

Total: **$0/month** until you have many users.

---

## Production hardening (later)

- Move to Render paid plan ($7/mo) → no sleep, no cron job needed
- Add Supabase free tier for cloud sync + auth (500MB DB, 50K users)
- EAS Production builds → submit to Play Store ($25 one-time)
