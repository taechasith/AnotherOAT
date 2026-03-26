import { generateChatReply } from "@/src/lib/chat";
import { createMockReply } from "@/src/lib/chat/mock-engine";
import { getCurrentSession, startSession } from "@/src/lib/session/session-service";
import type { ChatMessage } from "@/src/lib/types";

function chunkText(value: string) {
  return value.split(/(\s+)/).filter(Boolean);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input: string;
    history: ChatMessage[];
  };

  const encoder = new TextEncoder();
  const session = (await getCurrentSession()) ?? (await startSession());

  const stream = new ReadableStream({
    async start(controller) {
      let text = "";
      let mode = "openai";
      let reason: string | null = null;

      try {
        text = await generateChatReply(body.input, session.mindState, body.history ?? []);
      } catch (error) {
        console.error("api/chat/stream error", error);
        const errorCode =
          typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
        const errorStatus =
          typeof error === "object" && error && "status" in error ? String(error.status) : undefined;

        reason =
          errorCode === "insufficient_quota" || errorStatus === "429"
            ? "AI provider quota is unavailable"
            : error instanceof Error
              ? error.message
              : "Unknown AI provider error";

        text = `${await createMockReply(body.input, session.mindState, body.history ?? [])}\n\n[ระบบใช้คำตอบสำรองชั่วคราว เพราะบริการ AI ภายนอกยังไม่พร้อม]`;
        mode = "mock-fallback";
      }

      for (const piece of chunkText(text)) {
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: "chunk", text: piece })}\n`));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      controller.enqueue(encoder.encode(`${JSON.stringify({ type: "done", mode, reason })}\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
