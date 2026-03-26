import { sourcesConfig } from "@/src/config/sources";
import { mockMentionProvider } from "@/src/lib/providers/mock-provider";
import type { MentionProvider } from "@/src/lib/providers/types";

const providerMap: Record<string, MentionProvider> = {
  [mockMentionProvider.id]: mockMentionProvider,
};

export function getActiveMentionProviders() {
  return sourcesConfig.providerList
    .filter((provider) => provider.enabled)
    .map((provider) => providerMap[provider.id])
    .filter(Boolean);
}
