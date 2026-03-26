import { sourcesConfig } from "@/src/config/sources";
import { googleNewsMentionProvider } from "@/src/lib/providers/google-news-provider";
import { mockMentionProvider } from "@/src/lib/providers/mock-provider";
import type { MentionProvider } from "@/src/lib/providers/types";

const providerMap: Record<string, MentionProvider> = {
  [googleNewsMentionProvider.id]: googleNewsMentionProvider,
  [mockMentionProvider.id]: mockMentionProvider,
};

export function getActiveMentionProviders() {
  return sourcesConfig.providerList
    .filter((provider) => provider.enabled)
    .map((provider) => providerMap[provider.id])
    .filter(Boolean);
}
