// Scan API client. OWNER: Shimul (feat/scan). Remove the mock-on-empty
// fabrication here and surface an honest "no food" result instead.
import { postJSON } from './client';
import { mockScanFood } from '../mockAI';

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

function pickEmoji(cat) {
  const map = {
    rice: '🍚', dal: '🥣', fish: '🐟', meat: '🍗', vegetable: '🥬',
    fruit: '🥭', snack: '🥟', dairy: '🥛', other: '🍽️',
  };
  return map[cat] || '🍽️';
}
