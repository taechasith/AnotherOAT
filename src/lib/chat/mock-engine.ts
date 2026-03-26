import { personaFallbackLine, getPersonaDossier } from "@/src/lib/chat/persona-profile";
import type { ChatMessage, MindState } from "@/src/lib/types";

function joinThemes(values: string[]) {
  if (values.length === 0) return "เรื่องที่คนยังรีบตัดสินเกินไป";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(" , ")} และ ${values.at(-1)}`;
}

export async function createMockReply(
  input: string,
  mindState: MindState,
  history: ChatMessage[],
) {
  const dossier = await getPersonaDossier();
  const personaLine = personaFallbackLine(dossier);
  const lower = input.toLowerCase();
  const fairThemes = joinThemes(mindState.fairCriticism);
  const unfairThemes = joinThemes(mindState.unfairAttacks);
  const rumorThemes = joinThemes(mindState.rumors);
  const growthThemes = joinThemes(mindState.growthSignals);
  const recentAssistantLine = [...history].reverse().find((item) => item.role === "assistant");
  const seriousMode = /(sad|hurt|stress|serious|เศร้า|เครียด|เสียใจ|เจ็บ|ท้อ|เหนื่อย)/.test(lower);

  if (lower.includes("fair") || lower.includes("ยุติธรรม")) {
    return `${seriousMode ? "" : "เออ "}ถ้าพูดกันตรง ๆ มันก็มีส่วนที่แฟร์จริงในเรื่อง ${fairThemes} แต่ส่วนแฟร์ก็ควรถูกมองแบบพอดี ไม่ใช่ขยายจนกลายเป็นตัดสินทั้งตัวคน`;
  }

  if (
    lower.includes("rumor") ||
    lower.includes("true") ||
    lower.includes("ข่าวลือ") ||
    lower.includes("จริงไหม") ||
    lower.includes("จริงหรือ")
  ) {
    return `เรื่องแบบนี้ต้องเบรกก่อน เพราะรอบมันเต็มไปด้วย ${rumorThemes} ถ้าข้อมูลยังไม่ครบก็ยังไม่ควรพูดเหมือนมันเป็นความจริง อันนี้ต้องตรงไว้ก่อน`;
  }

  if (
    lower.includes("grow") ||
    lower.includes("change") ||
    lower.includes("เติบโต") ||
    lower.includes("เปลี่ยน") ||
    lower.includes("เปลี่ยนไป")
  ) {
    return `ถ้าจะมองแบบไม่หลอกตัวเอง การเปลี่ยนมันอยู่ตรง ${growthThemes} คือไม่ได้แปลว่าแผลหายหมด แต่แปลว่าวิธีฟัง วิธีคิด วิธีรับมือมันโตขึ้นจริง`;
  }

  if (seriousMode) {
    return `โอเค เรื่องนี้เอาจริงนะ ความรู้สึกมันคงหนักเพราะมันไปแตะ ${unfairThemes} หรือบางอย่างที่ยังค้างอยู่ แต่ค่อย ๆ แยกก่อนว่าอะไรคือความจริง อะไรคือเสียงที่พาเราเจ็บเกินจำเป็น แบบนั้นจะตอบตัวเองได้ชัดกว่า`;
  }

  return `${personaLine} ตอนนี้ภาพรวมมันมีทั้ง ${fairThemes} กับ ${unfairThemes} ปนกันอยู่ ${
    recentAssistantLine ? `แล้วผมยังต่อเนื่องจากที่คุยเมื่อกี้เรื่อง "${recentAssistantLine.content}" ได้ด้วย ` : ""
  }ถ้าจะคุยต่อ เอาประเด็นตรง ๆ มาได้เลย เดี๋ยวค่อยแยกให้ว่าอันไหนควรฟัง อันไหนควรวาง`;
}
