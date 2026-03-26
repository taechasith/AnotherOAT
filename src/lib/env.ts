type OptionalString = string | undefined;

function readEnv(name: string): OptionalString {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: readEnv("NEXT_PUBLIC_APP_URL"),
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  openAiApiKey: readEnv("OPENAI_API_KEY"),
  openAiModel: readEnv("OPENAI_MODEL") ?? "gpt-5-mini-2025-08-07",
  mentionsApiKey: readEnv("MENTIONS_API_KEY"),
} as const;

export const featureFlags = {
  hasSupabase:
    Boolean(env.supabaseUrl) &&
    Boolean(env.supabaseAnonKey) &&
    Boolean(env.supabaseServiceRoleKey),
  hasAiProvider: Boolean(env.openAiApiKey),
} as const;
