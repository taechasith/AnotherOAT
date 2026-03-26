import OpenAI from "openai";

import { env } from "@/src/lib/env";
import { personaConfig } from "@/src/config/persona";
import type { ChatMessage, MindState } from "@/src/lib/types";

let client: OpenAI | null = null;

function getClient() {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: env.openAiApiKey,
    });
  }

  return client;
}

function buildMindStateBlock(mindState: MindState) {
  return [
    `ระดับน้ำหนักทางอารมณ์: ${mindState.emotionalWeight}`,
    `สรุปใจตอนนี้: ${mindState.summary}`,
    `คำวิจารณ์ที่ยุติธรรม: ${mindState.fairCriticism.join(", ") || "ไม่มีสัญญาณเด่นชัด"}`,
    `การโจมตีที่ไม่ยุติธรรม: ${mindState.unfairAttacks.join(", ") || "ไม่มีสัญญาณเด่นชัด"}`,
    `ข่าวลือหรือข้อมูลไม่ชัด: ${mindState.rumors.join(", ") || "ไม่มีสัญญาณเด่นชัด"}`,
    `สัญญาณของการเติบโต: ${mindState.growthSignals.join(", ") || "ไม่มีสัญญาณเด่นชัด"}`,
  ].join("\n");
}

export async function createOpenAiReply(
  input: string,
  mindState: MindState,
  history: ChatMessage[],
) {
  const openai = getClient();

  const response = await openai.responses.create({
    model: env.openAiModel,
    reasoning: { effort: "medium" },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `${personaConfig.systemInstruction}

กติกาความปลอดภัย:
${personaConfig.safetyGuardrails.map((item) => `- ${item}`).join("\n")}

บริบทของสภาพใจในรอบนี้:
${buildMindStateBlock(mindState)}

ข้อกำหนดการตอบ:
- ตอบเป็นภาษาไทย
- น้ำเสียงต้องสงบ อ่อนโยน สุขุม และเป็นมนุษย์
- แยกให้ชัดว่าอะไรคือคำวิจารณ์ที่ยุติธรรม อะไรคือการโจมตี และอะไรคือข่าวลือ
- ถ้าผู้ใช้ถามเรื่องที่ข้อมูลไม่พอ ให้บอกอย่างตรงไปตรงมาว่ายังไม่แน่ชัด
- ห้ามใช้ถ้อยคำทำร้ายตัวเอง สิ้นหวัง หรือยุยงความเกลียดชัง`,
          },
        ],
      },
      ...history.slice(-10).map((message) => ({
        role: message.role,
        content: [
          {
            type: "input_text" as const,
            text: message.content,
          },
        ],
      })),
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: input,
          },
        ],
      },
    ],
  });

  return response.output_text.trim();
}
