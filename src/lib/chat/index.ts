import { featureFlags } from "@/src/lib/env";
import { createMockReply } from "@/src/lib/chat/mock-engine";
import { createOpenAiReply } from "@/src/lib/chat/openai-engine";
import type { ChatMessage, MindState } from "@/src/lib/types";

export async function generateChatReply(
  input: string,
  mindState: MindState,
  history: ChatMessage[],
) {
  if (featureFlags.hasAiProvider) {
    return createOpenAiReply(input, mindState, history);
  }

  return createMockReply(input, mindState, history);
}
