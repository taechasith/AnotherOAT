import { NextResponse } from "next/server";

import { getCurrentSession, startSession } from "@/src/lib/session/session-service";

export async function GET() {
  const session = (await getCurrentSession()) ?? (await startSession());

  return NextResponse.json({
    ok: true,
    mentions: session.mentions,
    mindState: session.mindState,
  });
}
