import { personaConfig } from "@/src/config/persona";
import type { ChatMessage, MindState } from "@/src/lib/types";

function joinThemes(values: string[]) {
  if (values.length === 0) return "ส่วนที่ผู้คนยังรีบตัดสินเกินไป";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(" , ")} และ ${values.at(-1)}`;
}

export function createMockReply(input: string, mindState: MindState, history: ChatMessage[]) {
  const lower = input.toLowerCase();
  const fairThemes = joinThemes(mindState.fairCriticism);
  const unfairThemes = joinThemes(mindState.unfairAttacks);
  const rumorThemes = joinThemes(mindState.rumors);
  const growthThemes = joinThemes(mindState.growthSignals);
  const recentAssistantLine = [...history].reverse().find((item) => item.role === "assistant");

  if (lower.includes("fair") || lower.includes("ยุติธรรม")) {
    return `บางส่วนก็ยุติธรรมจริง ฉันมองเห็นเรื่อง ${fairThemes} ได้โดยไม่ต้องปล่อยให้ตัวเองจมลงไปในความละอาย คำวิจารณ์แบบนั้นกำลังขอให้ฉันซื่อสัตย์ขึ้น ไม่ใช่หดเล็กลง`;
  }

  if (
    lower.includes("rumor") ||
    lower.includes("true") ||
    lower.includes("ข่าวลือ") ||
    lower.includes("จริงไหม") ||
    lower.includes("จริงหรือ")
  ) {
    return `เรื่องนั้นฉันต้องระวังมาก เพราะเสียงรอบตัวจำนวนไม่น้อยเต็มไปด้วย ${rumorThemes} และฉันไม่อยากเปลี่ยนความไม่แน่ใจให้กลายเป็นการยอมรับผิดแบบลอย ๆ ถ้าความมั่นใจต่ำ คำตอบที่ซื่อตรงที่สุดคือภาพรวมยังไม่ครบ`;
  }

  if (
    lower.includes("grow") ||
    lower.includes("change") ||
    lower.includes("เติบโต") ||
    lower.includes("เปลี่ยน") ||
    lower.includes("เปลี่ยนไป")
  ) {
    return `สิ่งที่เปลี่ยนไปคือความสัมพันธ์ของฉันกับความเจ็บ ฉันยังรู้สึกมันอยู่ แต่ไม่ยอมให้มันจับพวงมาลัยชีวิต ฉันยังกลับมามองเรื่อง ${growthThemes} ซ้ำ ๆ เพราะการเติบโตจะมีความหมายก็ต่อเมื่อมันเปลี่ยนวิธีที่ฉันฟังและวิธีที่ฉันตอบสนอง`;
  }

  if (
    lower.includes("hurt") ||
    lower.includes("sad") ||
    lower.includes("เจ็บ") ||
    lower.includes("เศร้า") ||
    lower.includes("เสียใจ")
  ) {
    return `ความเจ็บนั้นจริง และมันมักกองอยู่รอบเรื่อง ${unfairThemes} สิ่งที่ทำให้ฉันล้าไม่ใช่การถูกวิจารณ์ แต่คือการถูกแช่แข็งไว้ในเวอร์ชันหนึ่งของตัวเอง ที่ไม่เหลือพื้นที่ให้บริบท การเยียวยา หรือเวลา`;
  }

  const weightLabel =
    mindState.emotionalWeight === "heavy"
      ? "หนัก"
      : mindState.emotionalWeight === "moderate"
        ? "ปานกลาง"
        : "เบาลง";

  return `ฉันได้ยินคำถามที่ซ่อนอยู่ใต้ถ้อยคำนั้น ตอนนี้ใจของฉันรู้สึก${weightLabel} และยังคงคัดแยกอยู่ว่าอะไรสอนได้ อะไรมีไว้เพียงเพื่อทำให้เจ็บ ${
    recentAssistantLine ? `สิ่งที่ฉันยังกลับไปคิดซ้ำคือ ${recentAssistantLine.content}` : ""
  } ${personaConfig.sampleBeliefsNow[0]}`;
}
