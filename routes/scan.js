const express = require('express');
const router = express.Router();
const gemini = require('../services/gemini');
const cache = require('../services/cache');

router.post('/food', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', profile = {}, cacheKey } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 required' });
  }
  if (imageBase64.length > 2_500_000) {
    return res.status(413).json({ error: 'Image too large. Compress before upload.' });
  }

  if (cacheKey) {
    const hit = cache.get('scan', cacheKey);
    if (hit) return res.json({ ...hit, cached: true });
  }

  try {
    const result = await gemini.scanFood(imageBase64, mimeType, profile);
    if (cacheKey) cache.set('scan', cacheKey, result);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err?.status === 429 || /429/.test(String(err))) {
      return res.status(429).json({
        error: 'অনুরোধ বেশি হয়েছে',
        message: 'একটু পরে আবার চেষ্টা করুন',
        retry_after: 15,
      });
    }
    console.error('[scan]', err);
    res.status(500).json({ error: 'স্ক্যান করা সম্ভব হয়নি', detail: String(err.message || err) });
  }
});

module.exports = router;
