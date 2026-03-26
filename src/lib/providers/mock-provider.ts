import mentions from "@/src/mock/mentions.json";
import type { MentionProvider } from "@/src/lib/providers/types";

export const mockMentionProvider: MentionProvider = {
  id: "mock-public-summaries",
  async fetchMentions(options) {
    options?.emit?.({
      phase: "fallback",
      message: "ใช้ข้อมูลจำลองสำรอง เพราะยังไม่มีผลลัพธ์จริงเพียงพอ",
      source: "mock-public-summaries",
      count: mentions.length,
    });

    return mentions;
  },
};
