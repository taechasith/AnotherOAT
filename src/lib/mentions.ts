import { sourcesConfig } from "@/src/config/sources";
import { getActiveMentionProviders } from "@/src/lib/providers";
import type { MentionProviderProgress } from "@/src/lib/providers/types";
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
  return (
    sourcesConfig.searchTerms.some((term) => {
      const normalized = term.toLowerCase().replace(/"/g, "");
      return haystack.includes(normalized);
    }) || item.tags.some((tag) => ["growth", "misreading", "public-image"].includes(tag))
  );
}

export async function fetchSessionMentions(
  emit?: (event: MentionProviderProgress) => void,
) {
  const providers = getActiveMentionProviders().slice(
    0,
    sourcesConfig.fetchLimits.maxProvidersPerSession,
  );
  const deduped = new Map<string, MentionItem>();

  for (const provider of providers) {
    emit?.({
      phase: "provider",
      message: "เริ่มใช้งานผู้ให้ข้อมูล",
      source: provider.id,
    });

    const batch = await provider.fetchMentions({ emit });
    for (const item of batch) {
      const normalized = normalizeMention(item);
      if (!isRelevantToOat(normalized)) continue;

      const key = normalized.url || normalized.id;
      if (!deduped.has(key)) {
        deduped.set(key, normalized);
      }
    }
  }

  emit?.({
    phase: "fetched",
    message: "รวมผลลัพธ์จากทุกแหล่งข้อมูลแล้ว",
    count: deduped.size,
  });

  return [...deduped.values()]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, sourcesConfig.fetchLimits.maxItemsPerSession);
}
