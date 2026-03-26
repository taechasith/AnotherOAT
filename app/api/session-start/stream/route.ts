import { startSession } from "@/src/lib/session/session-service";
import type { SessionProgressEvent, SessionStartOptions } from "@/src/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("forceRefresh") === "1";
  const options: SessionStartOptions = {
    maxItems: searchParams.get("maxItems") ? Number(searchParams.get("maxItems")) : undefined,
    rangeDays: searchParams.get("rangeDays")
      ? Number(searchParams.get("rangeDays"))
      : undefined,
  };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (payload: { type: string; data: unknown }) => {
        controller.enqueue(
          encoder.encode(`event: ${payload.type}\ndata: ${JSON.stringify(payload.data)}\n\n`),
        );
      };

      try {
        const events: SessionProgressEvent[] = [];
        const session = await startSession(forceRefresh, (event) => {
          events.push(event);
          send({ type: "progress", data: event });
        }, options);

        send({ type: "completed", data: { session, events } });
      } catch (error) {
        send({
          type: "error",
          data: {
            message: error instanceof Error ? error.message : "Unknown session-start error",
          },
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
