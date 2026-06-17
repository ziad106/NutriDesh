// In-memory LRU-ish cache. Replace with Supabase if configured.
const CACHE = new Map();
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function key(prefix, id) { return `${prefix}:${id}`; }

function get(prefix, id) {
  const k = key(prefix, id);
  const entry = CACHE.get(k);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    CACHE.delete(k);
    return null;
  }
  entry.hits = (entry.hits || 0) + 1;
  return entry.value;
}

function set(prefix, id, value) {
  CACHE.set(key(prefix, id), { value, ts: Date.now(), hits: 0 });
}

function stats() {
  return { size: CACHE.size };
}

module.exports = { get, set, stats };
