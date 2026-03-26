import type { MentionItem } from "@/src/lib/types";

export type MentionProvider = {
  id: string;
  fetchMentions: () => Promise<MentionItem[]>;
};
