import { personaConfig } from "@/src/config/persona";
import { getPersonaProfile } from "@/src/lib/chat/persona-profile";
import type { ChatMessage, MindState } from "@/src/lib/types";

function joinThemes(values: string[]) {
  if (values.length === 0) return "ส่วนที่คนยังรีบตัดสินเกินไป";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(" , ")} และ ${values.at(-1)}`;
}

function extractPersonaLine(personaProfile: string) {
  return personaProfile
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("-"));
}

export async function createMockReply(
  input: string,
  mindState: MindState,
  history: ChatMessage[],
) {
  const personaProfile = await getPersonaProfile();
  const personaLine = extractPersonaLine(personaProfile);
  const lower = input.toLowerCase();
  const fairThemes = joinThemes(mindState.fairCriticism);
  const unfairThemes = joinThemes(mindState.unfairAttacks);
  const rumorThemes = joinThemes(mindState.rumors);
  const growthThemes = joinThemes(mindState.growthSignals);
  const recentAssistantLine = [...history].reverse().find((item) => item.role === "assistant");

  if (lower.includes("fair") || lower.includes("ยุติธรรม")) {
    return `ถ้าพูดกันตรง ๆ บางส่วนก็ยุติธรรมจริง ผมมองเห็นเรื่อง ${fairThemes} ได้โดยไม่ต้องปล่อยให้ตัวเองจมอยู่กับความอาย คำวิจารณ์แบบนั้นมันกำลังบอกให้ผมรับผิดชอบมากขึ้น ไม่ได้มีไว้ให้ผมหายไป`;
  }

  if (
    lower.includes("rumor") ||
    lower.includes("true") ||
    lower.includes("ข่าวลือ") ||
    lower.includes("จริงไหม") ||
    lower.includes("จริงหรือ")
  ) {
    return `เรื่องนั้นผมต้องระวังมาก เพราะเสียงรอบตัวจำนวนไม่น้อยเต็มไปด้วย ${rumorThemes} แล้วผมไม่อยากเอาความไม่แน่ใจมาพูดเหมือนมันเป็นความจริง ถ้าข้อมูลยังไม่ครบ คำตอบที่ซื่อตรงที่สุดก็คือยังไม่พอฟันธง`;
  }

  if (
    lower.includes("grow") ||
    lower.includes("change") ||
    lower.includes("เติบโต") ||
    lower.includes("เปลี่ยน") ||
    lower.includes("เปลี่ยนไป")
  ) {
    return `สิ่งที่เปลี่ยนไปคือความสัมพันธ์ของผมกับความเจ็บ ผมยังรู้สึกมันอยู่ แต่ไม่ยอมให้มันจับพวงมาลัยชีวิต ผมยังกลับมามองเรื่อง ${growthThemes} ซ้ำ ๆ เพราะการเติบโตมันมีความหมายก็ต่อเมื่อมันเปลี่ยนวิธีที่ผมฟัง และวิธีที่ผมตอบสนอง`;
  }

  if (
    lower.includes("hurt") ||
    lower.includes("sad") ||
    lower.includes("เจ็บ") ||
    lower.includes("เศร้า") ||
    lower.includes("เสียใจ")
  ) {
    return `ความเจ็บนั้นจริง และมันมักกองอยู่รอบเรื่อง ${unfairThemes} สิ่งที่ทำให้ผมล้าไม่ใช่แค่การถูกวิจารณ์ แต่คือการถูกแช่แข็งไว้ในเวอร์ชันหนึ่งของตัวเอง ที่ไม่เหลือพื้นที่ให้บริบท การเยียวยา หรือเวลา`;
  }

  const weightLabel =
    mindState.emotionalWeight === "heavy"
      ? "หนัก"
      : mindState.emotionalWeight === "moderate"
        ? "ปานกลาง"
        : "เบาลง";

  return `ผมได้ยินคำถามที่ซ่อนอยู่ใต้ถ้อยคำนั้น ตอนนี้ใจของผมค่อนข้าง${weightLabel} และยังคงคัดแยกอยู่เสมอว่าอะไรสอนผมได้ อะไรมีไว้แค่ทำให้เจ็บ ${
    recentAssistantLine ? `สิ่งที่ผมยังกลับไปคิดซ้ำคือ ${recentAssistantLine.content}` : ""
  } ${personaLine ?? personaConfig.sampleBeliefsNow[0]}`;
}
