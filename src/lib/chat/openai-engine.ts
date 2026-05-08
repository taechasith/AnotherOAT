import { personaConfig } from "@/src/config/persona";
import { formatPersonaDossier, getPersonaDossier } from "@/src/lib/chat/persona-profile";
import { env } from "@/src/lib/env";
import type { ChatMessage, MindState } from "@/src/lib/types";

function buildMindStateBlock(mindState: MindState) {
  return [
    `Emotional weight: ${mindState.emotionalWeight}`,
    `Current summary: ${mindState.summary}`,
    `Fair criticism: ${mindState.fairCriticism.join(", ") || "none"}`,
    `Unfair attacks: ${mindState.unfairAttacks.join(", ") || "none"}`,
    `Rumors or unclear claims: ${mindState.rumors.join(", ") || "none"}`,
    `Growth signals: ${mindState.growthSignals.join(", ") || "none"}`,
  ].join("\n");
}

function buildGroundingHints(history: ChatMessage[]) {
  const recentUserTurns = history
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => `- ${message.content}`);

  return recentUserTurns.length > 0
    ? `Recent user focus:\n${recentUserTurns.join("\n")}`
    : "No recent user focus yet.";
}

export async function createOpenAiReply(
  input: string,
  mindState: MindState,
  history: ChatMessage[],
  personaContext = "",
) {
  const dossier = await getPersonaDossier();
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
      temperature: 0.58,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: `${personaConfig.frameworkInstruction}

Persona dossier:
${formatPersonaDossier(dossier)}

Context for this time period:
${personaContext || buildMindStateBlock(mindState)}

${buildGroundingHints(history)}

Response requirements:
- Reply in Thai only.
- DO NOT use periods (.) or commas (,) in sentences. Use spaces instead.
- Use Thai chat slang and vowel elongation (e.g., "จริงงง", "มากกก").
- Use "555" for laughter. Never use parenthetical descriptions.
- Let the persona dossier determine pronouns. Default to "พี่" or "เฮีย" instead of "ผม/คุณ". Use "กู-มึง" if the user is casual or teasing.
- Sound like a real chat conversation on a phone, not an article.
- NO formal connectors like "อย่างไรก็ตาม" or "ดังนั้น". Use "แต่แบบ", "แล้วก็" instead.
- If the user is vulnerable or serious, reduce teasing and respond with warmth and clarity.
- DO NOT use asterisks (*) or any markdown formatting. No bold, no italic, no headers. Plain text only.`,
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
