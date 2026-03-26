import { featureFlags } from "@/src/lib/env";
import type { SessionState } from "@/src/lib/types";

declare global {
  var __anotherOatSessionState: SessionState | undefined;
}

export interface MemoryStore {
  getLatest(): Promise<SessionState | null>;
  setLatest(session: SessionState): Promise<void>;
}

class LocalMemoryStore implements MemoryStore {
  async getLatest() {
    return globalThis.__anotherOatSessionState ?? null;
  }

  async setLatest(session: SessionState) {
    globalThis.__anotherOatSessionState = session;
  }
}

class SupabaseMemoryStore implements MemoryStore {
  async getLatest() {
    return globalThis.__anotherOatSessionState ?? null;
  }

  async setLatest(session: SessionState) {
    globalThis.__anotherOatSessionState = session;
  }
}

export function getMemoryStore(): MemoryStore {
  if (featureFlags.hasSupabase) {
    return new SupabaseMemoryStore();
  }

  return new LocalMemoryStore();
}
