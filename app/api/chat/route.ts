import { NextResponse } from "next/server";

import { generateChatReply } from "@/src/lib/chat";
import { getCurrentSession, startSession } from "@/src/lib/session/session-service";
import { createId } from "@/src/lib/utils";
import type { ChatMessage } from "@/src/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input: string;
    history: ChatMessage[];
  };

  const session = (await getCurrentSession()) ?? (await startSession());
  const reply = await generateChatReply(body.input, session.mindState, body.history ?? []);

  return NextResponse.json({
    ok: true,
    message: {
      id: createId("assistant"),
      role: "assistant",
      content: reply,
    } satisfies ChatMessage,
  });
}
