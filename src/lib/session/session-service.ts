import mentions from "@/src/mock/mentions.json";

import { siteConfig } from "@/src/config/site";
import { sourcesConfig } from "@/src/config/sources";
import { fetchSessionMentions } from "@/src/lib/mentions";
import { deriveMindState } from "@/src/lib/mind-state";
import { getMemoryStore } from "@/src/lib/stores/memory-store";
import { createId } from "@/src/lib/utils";
import type { SessionProgressEvent, SessionState } from "@/src/lib/types";

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

export async function startSession(
  forceRefresh = false,
  emit?: (event: SessionProgressEvent) => void,
): Promise<SessionState> {
  const store = getMemoryStore();
  const existing = await store.getLatest();

  emit?.(progress("started", "เริ่มต้นการดึงข้อมูลสำหรับเซสชันใหม่"));

  if (
    existing &&
    !forceRefresh &&
    Date.now() - Date.parse(existing.fetchedAt) < siteConfig.freshnessWindowMs
  ) {
    emit?.(
      progress("cached", "พบข้อมูลล่าสุดที่ยังสดอยู่ จึงใช้ของเดิมก่อน", {
        count: existing.mentions.length,
      }),
    );
    return existing;
  }

  let mentionItems = mentions;
  if (sourcesConfig.sessionStartIngestionEnabled) {
    try {
      mentionItems = await fetchSessionMentions((event) =>
        emit?.(progress(event.phase, event.message, event)),
      );
      if (mentionItems.length === 0) {
        mentionItems = mentions;
        emit?.(
          progress("fallback", "ไม่พบผลลัพธ์จริงที่ใช้ได้ จึงใช้ข้อมูลจำลองสำรอง", {
            count: mentionItems.length,
          }),
        );
      }
    } catch (error) {
      emit?.(
        progress("fallback", "ดึงข้อมูลจริงไม่สำเร็จ จึงสลับไปใช้ข้อมูลจำลอง", {
          detail: error instanceof Error ? error.message : "Unknown provider error",
        }),
      );
    }
  }

  emit?.(
    progress("deduplicated", "คัดกรองและตัดข้อมูลซ้ำเรียบร้อย", {
      count: mentionItems.length,
    }),
  );

  const session: SessionState = {
    mentions: mentionItems,
    mindState: deriveMindState(mentionItems),
    fetchedAt: new Date().toISOString(),
    source: "session-start",
  };

  emit?.(progress("analyzed", "สรุปสภาพใจจากข้อมูลที่ดึงมาเสร็จแล้ว"));

  await store.setLatest(session);
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
