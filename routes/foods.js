const express = require('express');
const router = express.Router();
const FOODS = require('../data/foods');

router.get('/', (req, res) => {
  const { q, category, limit = 50 } = req.query;
  let results = FOODS;
  if (q) {
    const needle = q.toLowerCase();
    results = results.filter(
      (f) => f.name_bn.includes(q) || f.name_en.toLowerCase().includes(needle)
    );
  }
  if (category) results = results.filter((f) => f.category === category);
  res.json({ count: results.length, items: results.slice(0, Number(limit)) });
});

router.get('/:id', (req, res) => {
  const food = FOODS.find((f) => f.id === req.params.id);
  if (!food) return res.status(404).json({ error: 'not found' });
  res.json(food);
});

module.exports = router;
