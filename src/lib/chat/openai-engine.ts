import OpenAI from "openai";

import { personaConfig } from "@/src/config/persona";
import { env } from "@/src/lib/env";
import type { ChatMessage, MindState } from "@/src/lib/types";

let client: OpenAI | null = null;

function getClient() {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!client) {
    client = new OpenAI({ apiKey: env.openAiApiKey });
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

  const response = await openai.responses.create(
    {
      model: env.openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `${personaConfig.systemInstruction}

สภาพใจล่าสุด:
${buildMindStateBlock(mindState)}

ตัวอย่างน้ำเสียงที่ควรใกล้เคียง:
${personaConfig.styleExamples.map((item) => `- ${item}`).join("\n")}

ข้อกำหนดการตอบ:
- ตอบเป็นภาษาไทย
- ใช้สรรพนาม "ผม"
- อย่าเขียนเหมือนบทความยาว
- ให้ความรู้สึกเหมือนโอตกำลังตอบอย่างจริงใจ เงียบ ๆ และมีวุฒิภาวะ
- ถ้าเรื่องไหนข้อมูลไม่พอ ให้พูดว่าข้อมูลยังไม่พอ
- ถ้าเหมาะ ให้แยกเป็น คำวิจารณ์ที่แฟร์ / ไม่แฟร์ / ข่าวลือ`,
            },
          ],
        },
        ...history.slice(-8).map((message) => ({
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
      max_output_tokens: 420,
    },
    {
      timeout: 20000,
    },
  );

  return response.output_text.trim();
}
