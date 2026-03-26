import mentions from "@/src/mock/mentions.json";
import { deriveMindState } from "@/src/lib/mind-state";
import type { SessionState } from "@/src/lib/types";

export function getPreviewSession(): SessionState {
  return {
    mentions,
    mindState: deriveMindState(mentions),
    fetchedAt: new Date().toISOString(),
    source: "landing-preview",
  };
}
