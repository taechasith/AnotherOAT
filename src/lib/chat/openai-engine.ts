import { personaConfig } from "@/src/config/persona";
import { getPersonaProfile } from "@/src/lib/chat/persona-profile";
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
) {
  const personaProfile = await getPersonaProfile();
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
      max_tokens: 420,
      messages: [
        {
          role: "system",
          content: `${personaConfig.systemInstruction}

${personaProfile ? `Persona profile from editable markdown:
${personaProfile}

Use this profile as extra guidance for personality, tone, worldview, boundaries, and recurring traits. If it conflicts with the latest mind state, prioritize the mind state.

` : ""}Latest mind state:
${buildMindStateBlock(mindState)}

${buildGroundingHints(history)}

Style examples:
${personaConfig.styleExamples.map((item) => `- ${item}`).join("\n")}

Response blueprint:
${personaConfig.responseBlueprint.map((item) => `- ${item}`).join("\n")}

Voice anchors:
${personaConfig.voiceAnchors.map((item) => `- ${item}`).join("\n")}

Response requirements:
- Reply in Thai.
- Match the persona profile's natural pronouns and register for the situation.
- Sound like a real chat conversation, not an article.
- Ground the answer in the mind state before guessing.
- If information is insufficient, say so plainly.
- When relevant, separate fair criticism, unfair criticism, and rumors.
- Avoid preachy or therapist-like phrasing.
- If the user is casual, you can be playful and fast.
- If the user is vulnerable or serious, reduce the teasing and respond with warmth and clarity.`,
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
