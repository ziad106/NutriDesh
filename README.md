# NutriDesh Backend

Express + Gemini AI nutrition API for the [NutriDesh](https://github.com/) mobile app — Bangladesh-focused nutrition tracker.

## Features

- POST `/api/scan/food` — image → identified BD foods (Gemini Flash vision)
- POST `/api/chat` — Bangla nutrition assistant with profile context
- POST `/api/recommendations` — meal suggestions with budget constraint
- GET `/api/foods` — search 18+ pre-seeded BD foods
- Auto-fallback to deterministic mock responses when no API key
- Rate-limited (10 req/min on AI endpoints)
- In-memory response cache (30-day TTL)

## Stack

- Node 20+
- Express 4
- `@google/generative-ai` (Gemini Flash latest)
- Helmet + CORS + compression + rate-limit

## Setup

```bash
git clone https://github.com/YOUR_USER/NutriDesh.git
cd NutriDesh
npm install
cp .env.example .env
# edit .env — add your GEMINI_API_KEY
npm start
```

Server runs on `http://localhost:3000` by default. Override with `PORT=3737 npm start`.

## Environment

| Var | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No (falls back to mock) | Get free at https://aistudio.google.com/apikey |
| `PORT` | No | Default 3000 |
| `ALLOWED_ORIGINS` | No | CORS allowed origins, `*` for any |
| `NODE_ENV` | No | `development` or `production` |

## Deploy to Render (free tier)

1. Fork this repo
2. https://render.com → New Web Service → connect repo
3. Build: `npm install` | Start: `node server.js`
4. Add env var: `GEMINI_API_KEY`
5. Deploy. Keep alive with cron-job.org → `/ping` every 14 min.

See `render.yaml` for auto-config.

## API quick reference

```bash
# Health
curl http://localhost:3000/ping

# Chat
curl -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"আজ কী খাব?","profile":{"name":"Test","conditions":["diabetes"]}}'

# Food scan (base64 image)
curl -X POST http://localhost:3000/api/scan/food \
  -H 'Content-Type: application/json' \
  -d '{"imageBase64":"...","mimeType":"image/jpeg"}'

# Recommendations
curl -X POST http://localhost:3000/api/recommendations \
  -H 'Content-Type: application/json' \
  -d '{"profile":{"conditions":["diabetes"]},"budget":150}'
```

## Disclaimer

NutriDesh is a nutrition tracking and education tool, **not a medical device**. Consult a registered dietician or physician for medical decisions.

## License

MIT
