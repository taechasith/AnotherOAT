import type { MentionItem, MindState } from "@/src/lib/types";

const themeLabels: Record<string, string> = {
  distance: "ความห่างเหิน",
  "public-image": "ภาพจำสาธารณะ",
  expectations: "ความคาดหวัง",
  ego: "อีโก้",
  confidence: "ความมั่นใจ",
  misreading: "การถูกตีความผิด",
  "old-narratives": "เรื่องเล่าเก่า",
  growth: "การเติบโต",
  accountability: "ความรับผิดชอบ",
  rumor: "ข่าวลือ",
  misinformation: "ข้อมูลผิด",
  speculation: "การคาดเดา",
  "public-shift": "มุมมองสาธารณะที่เปลี่ยนไป",
  projection: "การโยนความคาดหวังใส่กัน",
  cruelty: "ความใจร้าย",
  reflection: "การทบทวนตัวเอง",
};

function pickThemes(mentions: MentionItem[], threshold: (item: MentionItem) => boolean) {
  return mentions
    .filter(threshold)
    .flatMap((item) => item.tags)
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, 4)
    .map((tag) => themeLabels[tag] ?? tag.replace(/-/g, " "));
}

export function deriveMindState(mentions: MentionItem[]): MindState {
  const fairCriticism = pickThemes(
    mentions,
    (item) =>
      item.tags.includes("accountability") ||
      item.tags.includes("distance") ||
      item.tags.includes("ego"),
  );

  const unfairAttacks = pickThemes(
    mentions,
    (item) =>
      item.tags.includes("projection") ||
      item.tags.includes("public-image") ||
      item.tags.includes("cruelty") ||
      item.tags.includes("misreading"),
  );

  const rumors = pickThemes(
    mentions,
    (item) => item.tags.includes("rumor") || item.tags.includes("misinformation"),
  );

  const growthSignals = pickThemes(
    mentions,
    (item) => item.tags.includes("growth") || item.tags.includes("public-shift"),
  );

  const averageNegativity =
    mentions.reduce((total, item) => total + item.negativityScore, 0) /
    Math.max(mentions.length, 1);

  const emotionalWeight =
    averageNegativity > 0.65 ? "heavy" : averageNegativity > 0.45 ? "moderate" : "light";

  const summary =
    emotionalWeight === "heavy"
      ? "ใจดวงนี้กำลังแบกทั้งคำวิจารณ์ ความเข้าใจผิดที่ถูกพูดซ้ำ และข่าวลือไว้พร้อมกัน มันต้องการทั้งความอ่อนโยนและขอบเขตที่ชัด"
      : emotionalWeight === "moderate"
        ? "ใจดวงนี้ยังช้ำอยู่ แต่เริ่มแยกแยะได้มากขึ้น บางคำวิจารณ์ควรเก็บมาทบทวน แต่เสียงจำนวนมากไม่คู่ควรกับพื้นที่ในใจ"
        : "ใจดวงนี้เริ่มนิ่งขึ้น เห็นร่องรอยของการเติบโตชัดขึ้น แม้เรื่องเล่าเก่ายังทอดเงาอยู่บ้าง";

  return {
    fairCriticism,
    unfairAttacks,
    rumors,
    growthSignals,
    emotionalWeight,
    summary,
    generatedAt: new Date().toISOString(),
  };
}
