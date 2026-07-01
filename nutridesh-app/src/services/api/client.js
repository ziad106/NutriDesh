// Shared HTTP client for the backend API. OWNER: Ziad.
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

export async function postJSON(path, body) {
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

export const API_BASE = API_URL;
