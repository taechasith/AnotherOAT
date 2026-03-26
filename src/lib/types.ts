export type MentionItem = {
  id: string;
  source: string;
  title: string;
  snippet: string;
  url: string;
  publishedAt: string;
  language: string;
  negativityScore: number;
  tags: string[];
};

export type MindState = {
  fairCriticism: string[];
  unfairAttacks: string[];
  rumors: string[];
  growthSignals: string[];
  emotionalWeight: "light" | "moderate" | "heavy";
  summary: string;
  generatedAt: string;
};

export type SessionState = {
  mentions: MentionItem[];
  mindState: MindState;
  fetchedAt: string;
  source: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
