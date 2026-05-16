require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS === '*' || !process.env.ALLOWED_ORIGINS
      ? true
      : process.env.ALLOWED_ORIGINS.split(','),
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'অনুরোধ বেশি হয়েছে। একটু পরে আবার চেষ্টা করুন।', retry_after: 60 },
});

app.use('/api/scan', aiLimiter);
app.use('/api/chat', aiLimiter);
app.use('/api/recommendations', aiLimiter);

app.use('/api/scan', require('./routes/scan'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/foods', require('./routes/foods'));

app.get('/', (req, res) => {
  const gemini = require('./services/gemini');
  res.json({
    app: 'NutriDesh API',
    status: 'ok',
    gemini: gemini.hasKey ? 'live' : 'mock',
    endpoints: [
      'POST /api/scan/food',
      'POST /api/chat',
      'POST /api/recommendations',
      'GET /api/foods?q=...',
      'GET /api/foods/:id',
      'GET /ping',
    ],
  });
});

app.get('/ping', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\n🌿 NutriDesh API running on http://localhost:${port}`);
  console.log(`   Gemini mode: ${require('./services/gemini').hasKey ? 'LIVE' : 'MOCK'}\n`);
});
