import mentions from "@/src/mock/mentions.json";
import type { MentionProvider } from "@/src/lib/providers/types";

export const mockMentionProvider: MentionProvider = {
  id: "mock-public-summaries",
  async fetchMentions() {
    return mentions;
  },
};
