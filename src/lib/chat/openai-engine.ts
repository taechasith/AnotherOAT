import { personaConfig } from "@/src/config/persona";
import { env } from "@/src/lib/env";
import type { ChatMessage, MindState } from "@/src/lib/types";

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
  const apiKey = env.openRouterApiKey ?? env.openAiApiKey;
  if (!apiKey) {
    throw new Error("No AI provider key configured.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(env.appUrl ? { "HTTP-Referer": env.appUrl } : {}),
      "X-Title": "another oat",
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      temperature: 0.65,
      max_tokens: 420,
      messages: [
        {
          role: "system",
          content: `${personaConfig.systemInstruction}

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
        ...history.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        {
          role: "user",
          content: input,
        },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    let errorPayload: unknown = null;
    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = await response.text();
    }

    const error = new Error(
      typeof errorPayload === "string" ? errorPayload : JSON.stringify(errorPayload),
    ) as Error & { status?: number; code?: string };
    error.status = response.status;
    error.code = response.status === 402 || response.status === 429 ? "insufficient_quota" : undefined;
    throw error;
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenRouter returned an empty completion.");
  }

  return text;
}
