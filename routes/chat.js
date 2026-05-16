const express = require('express');
const router = express.Router();
const gemini = require('../services/gemini');

router.post('/', async (req, res) => {
  const { message, profile = {}, todayLog = {}, history = [] } = req.body || {};
  const clean = (message || '').toString().trim().slice(0, 1000);
  if (!clean) return res.status(400).json({ error: 'message required' });

  try {
    const reply = await gemini.chat(clean, profile, todayLog, history);
    res.json({ response: reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[chat]', err);
    res.status(500).json({ error: 'উত্তর পাওয়া যায়নি', detail: String(err.message || err) });
  }
});

module.exports = router;
