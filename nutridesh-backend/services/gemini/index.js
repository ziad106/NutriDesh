// Aggregator — keeps the public API identical so `require('../services/gemini')`
// still returns { scanFood, chat, getRecommendations, hasKey }.
const { hasKey } = require('./client');
const { scanFood } = require('./scan');
const { chat } = require('./chat');
const { getRecommendations } = require('./recommend');

module.exports = { scanFood, chat, getRecommendations, hasKey };
