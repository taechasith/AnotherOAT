import { NextResponse } from "next/server";

import { startSession } from "@/src/lib/session/session-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { forceRefresh?: boolean };
  const session = await startSession(Boolean(body.forceRefresh));

  return NextResponse.json({
    ok: true,
    session,
  });
}
