import mentions from "@/data/mentions.json";

import { siteConfig } from "@/src/config/site";
import { sourcesConfig } from "@/src/config/sources";
import { getDefaultDataRange } from "@/src/lib/persona-lifecycle";
import { analyzePersonaContext } from "@/src/lib/chat/persona-analyzer";
import { fetchSessionMentions } from "@/src/lib/mentions";
import { deriveMindState } from "@/src/lib/mind-state";
import { getMemoryStore } from "@/src/lib/stores/memory-store";
import { createId } from "@/src/lib/utils";
import type { SessionProgressEvent, SessionStartOptions, SessionState } from "@/src/lib/types";

function progress(
  phase: SessionProgressEvent["phase"],
  message: string,
  extras?: Partial<SessionProgressEvent>,
): SessionProgressEvent {
  return {
    id: createId("progress"),
    phase,
    message,
    timestamp: new Date().toISOString(),
    ...extras,
  };
}

function hasCustomOptions(options?: SessionStartOptions) {
  return Boolean(
    options?.maxItems ||
      options?.rangeDays ||
      options?.startYear ||
      options?.endYear,
  );
}

export async function startSession(
  forceRefresh = false,
  emit?: (event: SessionProgressEvent) => void,
  options?: SessionStartOptions,
): Promise<SessionState> {
  // Apply lifecycle-derived year bounds when caller hasn't specified them.
  // This ensures data pulls always reflect current age and cap at death year.
  const { startYear: defaultStart, endYear: defaultEnd } = getDefaultDataRange();
  const resolvedOptions: SessionStartOptions = {
    startYear: options?.startYear ?? defaultStart,
    endYear: options?.endYear ?? defaultEnd,
    maxItems: options?.maxItems,
    rangeDays: options?.rangeDays,
  };

  const store = getMemoryStore();
  const existing = await store.getLatest();

  emit?.(progress("started", "เริ่มต้นการดึงข้อมูลสำหรับเซสชันใหม่"));

  if (
    existing &&
    !forceRefresh &&
    !hasCustomOptions(options) &&
    Date.now() - Date.parse(existing.fetchedAt) < siteConfig.freshnessWindowMs
  ) {
    emit?.(
      progress("cached", "พบข้อมูลล่าสุดที่ยังสดอยู่ จึงใช้ของเดิมก่อน", {
        count: existing.mentions.length,
      }),
    );
    return existing;
  }

  function applyFallback(message: string, detail?: string) {
    const { startYear, endYear, maxItems: limit } = resolvedOptions;
    const filtered = mentions.filter((item) => {
      const year = new Date(item.publishedAt).getUTCFullYear();
      if (Number.isNaN(year)) return false;
      if (startYear && year < startYear) return false;
      if (endYear && year > endYear) return false;
      return true;
    });
    const result = filtered.slice(0, limit ?? mentions.length);
    emit?.(progress("fallback", message, { count: result.length, detail }));
    return result;
  }

  let mentionItems = mentions;
  if (sourcesConfig.sessionStartIngestionEnabled) {
    try {
      mentionItems = await fetchSessionMentions(
        (event) => emit?.(progress(event.phase, event.message, event)),
        resolvedOptions,
      );
      if (mentionItems.length === 0) {
        mentionItems = applyFallback("ไม่พบผลลัพธ์จริงที่ใช้ได้ จึงใช้ข้อมูลจำลองสำรอง");
      }
    } catch (error) {
      mentionItems = applyFallback(
        "ดึงข้อมูลจริงไม่สำเร็จ จึงสลับไปใช้ข้อมูลจำลอง",
        error instanceof Error ? error.message : "Unknown provider error",
      );
    }
  }

  emit?.(
    progress("deduplicated", "คัดกรองและตัดข้อมูลซ้ำเรียบร้อย", {
      count: mentionItems.length,
    }),
  );

  emit?.(progress("analyzed", "สรุปสภาพใจจากข้อมูลที่ดึงมาเสร็จแล้ว"));

  emit?.(progress("persona-analyzing", "กำลังวิเคราะห์บริบทของโอ๊ตในช่วงเวลานี้..."));
  const personaContext = await analyzePersonaContext(mentionItems);

  const session: SessionState = {
    mentions: mentionItems,
    mindState: deriveMindState(mentionItems),
    personaContext,
    fetchedAt: new Date().toISOString(),
    source: "session-start",
  };

  if (!hasCustomOptions(options) || forceRefresh) {
    await store.setLatest(session);
  }

  emit?.(
    progress("completed", "พร้อมเข้าสู่บทสนทนา", {
      count: session.mentions.length,
    }),
  );
  return session;
}

export async function getCurrentSession() {
  const store = getMemoryStore();
  return store.getLatest();
}
