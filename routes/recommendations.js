const express = require('express');
const router = express.Router();
const gemini = require('../services/gemini');

router.post('/', async (req, res) => {
  const { profile = {}, todayLog = {}, budget = null } = req.body || {};
  try {
    const out = await gemini.getRecommendations(profile, todayLog, budget);
    res.json(out);
  } catch (err) {
    console.error('[reco]', err);
    res.status(500).json({ error: 'সাজেশন পাওয়া যায়নি', detail: String(err.message || err) });
  }
});

module.exports = router;
