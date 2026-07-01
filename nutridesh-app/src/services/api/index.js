// Aggregator — keeps `import { ... } from '../../services/api'` working exactly
// as before the split. OWNER: Ziad.
import { scanFood } from './scan';
import { chat } from './chat';
import { getRecommendations } from './recommend';
import { predictDeficiencies, whatCanICook } from './data';
import { API_BASE } from './client';

export { scanFood } from './scan';
export { chat } from './chat';
export { getRecommendations } from './recommend';
export { predictDeficiencies, whatCanICook } from './data';
export { API_BASE } from './client';

export default { scanFood, chat, getRecommendations, predictDeficiencies, whatCanICook, API_BASE };
