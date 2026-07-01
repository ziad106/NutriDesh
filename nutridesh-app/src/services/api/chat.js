// Chat API client. OWNER: Ziad (feat/chat). Add the language param here.
import { postJSON } from './client';
import { mockChat } from '../mockAI';

export async function chat(message, profile, todayLog, history) {
  try {
    const data = await postJSON('/api/chat', { message, profile, todayLog, history });
    return data.response;
  } catch (err) {
    console.warn('[api.chat] fallback to mock:', err.message);
    return mockChat(message, profile, todayLog, history);
  }
}
