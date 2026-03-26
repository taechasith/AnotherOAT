import { NextResponse } from "next/server";

import { startSession } from "@/src/lib/session/session-service";
import type { SessionStartOptions } from "@/src/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    forceRefresh?: boolean;
    options?: SessionStartOptions;
  };
  const session = await startSession(Boolean(body.forceRefresh), undefined, body.options);

  return NextResponse.json({
    ok: true,
    session,
  });
}
