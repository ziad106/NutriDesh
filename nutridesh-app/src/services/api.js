// Backend API client. Falls back to mockAI if backend unreachable.
import {
  mockScanFood,
  mockChat,
  mockRecommendations,
  mockPredictDeficiencies,
  mockWhatCanICook,
} from './mockAI';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const TIMEOUT_MS = 30_000;

async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function postJSON(path, body) {
  const url = `${API_URL}${path}`;
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// ── SCAN ─────────────────────────────────────────
export async function scanFood(imageBase64, mimeType, profile) {
  try {
    const data = await postJSON('/api/scan/food', { imageBase64, mimeType, profile });
    if (!data.items || data.items.length === 0) throw new Error('empty result');
    return {
      items: data.items.map((it) => ({ ...it, emoji: pickEmoji(it.category) })),
      plate_description_bn: data.plate_description_bn,
    };
  } catch (err) {
    console.warn('[api.scanFood] fallback to mock:', err.message);
    return mockScanFood();
  }
}

// ── CHAT ─────────────────────────────────────────
export async function chat(message, profile, todayLog, history) {
  try {
    const data = await postJSON('/api/chat', { message, profile, todayLog, history });
    return data.response;
  } catch (err) {
    console.warn('[api.chat] fallback to mock:', err.message);
    return mockChat(message, profile, todayLog, history);
  }
}

// ── RECOMMENDATIONS ──────────────────────────────
export async function getRecommendations(profile, todayLog, budget = null) {
  try {
    const data = await postJSON('/api/recommendations', { profile, todayLog, budget });
    return {
      recommendations: (data.recommendations || []).map((r) => ({
        ...r,
        emoji: r.emoji || '🍽️',
      })),
    };
  } catch (err) {
    console.warn('[api.recommendations] fallback to mock:', err.message);
    return mockRecommendations(profile, todayLog, budget);
  }
}

export async function predictDeficiencies(profile, last7DaysLogs) {
  return mockPredictDeficiencies(profile, last7DaysLogs);
}

export async function whatCanICook(ingredientsList, profile) {
  return mockWhatCanICook(ingredientsList, profile);
}

function pickEmoji(cat) {
  const map = {
    rice: '🍚', dal: '🥣', fish: '🐟', meat: '🍗', vegetable: '🥬',
    fruit: '🥭', snack: '🥟', dairy: '🥛', other: '🍽️',
  };
  return map[cat] || '🍽️';
}

export const API_BASE = API_URL;
export default { scanFood, chat, getRecommendations, predictDeficiencies, whatCanICook, API_BASE };
