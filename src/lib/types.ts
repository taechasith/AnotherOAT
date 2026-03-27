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

export type SessionStartOptions = {
  maxItems?: number;
  rangeDays?: number | null;
  startYear?: number;
  endYear?: number;
};

export type SessionProgressEvent = {
  id: string;
  phase:
    | "started"
    | "querying"
    | "provider"
    | "fetched"
    | "deduplicated"
    | "analyzed"
    | "cached"
    | "completed"
    | "fallback"
    | "error";
  message: string;
  detail?: string;
  count?: number;
  source?: string;
  timestamp: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};
