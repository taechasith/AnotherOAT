import mentions from "@/src/mock/mentions.json";
import { siteConfig } from "@/src/config/site";
import { sourcesConfig } from "@/src/config/sources";
import { fetchSessionMentions } from "@/src/lib/mentions";
import { deriveMindState } from "@/src/lib/mind-state";
import { getMemoryStore } from "@/src/lib/stores/memory-store";
import type { SessionState } from "@/src/lib/types";

export async function startSession(forceRefresh = false): Promise<SessionState> {
  const store = getMemoryStore();
  const existing = await store.getLatest();

  if (
    existing &&
    !forceRefresh &&
    Date.now() - Date.parse(existing.fetchedAt) < siteConfig.freshnessWindowMs
  ) {
    return existing;
  }

  const mentionItems = sourcesConfig.sessionStartIngestionEnabled
    ? await fetchSessionMentions()
    : mentions;
  const session: SessionState = {
    mentions: mentionItems,
    mindState: deriveMindState(mentionItems),
    fetchedAt: new Date().toISOString(),
    source: "session-start",
  };

  await store.setLatest(session);
  return session;
}

export async function getCurrentSession() {
  const store = getMemoryStore();
  return store.getLatest();
}
