import { sourcesConfig } from "@/src/config/sources";
import { getActiveMentionProviders } from "@/src/lib/providers";
import type { MentionItem } from "@/src/lib/types";

function normalizeMention(item: MentionItem): MentionItem {
  return {
    ...item,
    title: item.title.trim(),
    snippet: item.snippet.trim(),
    tags: [...new Set(item.tags.map((tag) => tag.toLowerCase()))],
  };
}

function isRelevantToOat(item: MentionItem) {
  const haystack = `${item.title} ${item.snippet}`.toLowerCase();
  return sourcesConfig.searchTerms.some((term) => {
    const normalized = term.toLowerCase().replace(/"/g, "");
    return haystack.includes(normalized);
  }) || item.tags.some((tag) => ["growth", "misreading", "public-image"].includes(tag));
}

export async function fetchSessionMentions() {
  const providers = getActiveMentionProviders().slice(
    0,
    sourcesConfig.fetchLimits.maxProvidersPerSession,
  );

  const batches = await Promise.all(providers.map((provider) => provider.fetchMentions()));
  const deduped = new Map<string, MentionItem>();

  for (const batch of batches.flat()) {
    const normalized = normalizeMention(batch);
    if (!isRelevantToOat(normalized)) continue;

    const key = normalized.url || normalized.id;
    if (!deduped.has(key)) {
      deduped.set(key, normalized);
    }
  }

  return [...deduped.values()]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, sourcesConfig.fetchLimits.maxItemsPerSession);
}
