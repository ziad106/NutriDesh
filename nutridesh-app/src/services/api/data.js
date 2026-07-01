// Deficiency prediction + "what can I cook". OWNER: Mohaiminul (feat/ui).
// Currently mock-only — keep these functional (real results, loading/empty
// states in the screens). Wire to the backend if/when an endpoint exists.
import { mockPredictDeficiencies, mockWhatCanICook } from '../mockAI';

export async function predictDeficiencies(profile, last7DaysLogs) {
  return mockPredictDeficiencies(profile, last7DaysLogs);
}

export async function whatCanICook(ingredientsList, profile) {
  return mockWhatCanICook(ingredientsList, profile);
}
