// Recommendations API client. OWNER: Ziad (feat/chat).
import { postJSON } from './client';
import { mockRecommendations } from '../mockAI';

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
