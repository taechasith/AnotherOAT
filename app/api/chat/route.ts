import { NextResponse } from "next/server";

import { generateChatReply } from "@/src/lib/chat";
import { createMockReply } from "@/src/lib/chat/mock-engine";
import { getCurrentSession, startSession } from "@/src/lib/session/session-service";
import { createId } from "@/src/lib/utils";
import type { ChatMessage } from "@/src/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input: string;
    history: ChatMessage[];
  };

  const session = (await getCurrentSession()) ?? (await startSession());
  let reply: string;
  let mode: "openai" | "mock-fallback" = "openai";

  try {
    reply = await generateChatReply(body.input, session.mindState, body.history ?? []);
  } catch (error) {
    reply = `${await createMockReply(body.input, session.mindState, body.history ?? [])}\n\n[หมายเหตุ: ตอนนี้การเชื่อมต่อ AI ภายนอกมีปัญหา จึงสลับมาใช้คำตอบสำรองชั่วคราว]`;
    mode = "mock-fallback";
    console.error("api/chat error", error);
  }

  return NextResponse.json({
    ok: true,
    mode,
    message: {
      id: createId("assistant"),
      role: "assistant",
      content: reply,
    } satisfies ChatMessage,
  });
}
