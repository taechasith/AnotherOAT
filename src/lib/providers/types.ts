import type { MentionItem } from "@/src/lib/types";

export type MentionProviderProgress = {
  phase: "querying" | "provider" | "fetched" | "fallback";
  message: string;
  detail?: string;
  count?: number;
  source?: string;
};

export type MentionProvider = {
  id: string;
  fetchMentions: (options?: {
    emit?: (event: MentionProviderProgress) => void;
  }) => Promise<MentionItem[]>;
};
