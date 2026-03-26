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
  openRouterApiKey: readEnv("OPENROUTER_API_KEY"),
  openRouterModel: readEnv("OPENROUTER_MODEL") ?? "openai/gpt-4.1-mini",
  mentionsApiKey: readEnv("MENTIONS_API_KEY"),
  xBearerToken: readEnv("X_BEARER_TOKEN"),
} as const;

export const featureFlags = {
  hasSupabase:
    Boolean(env.supabaseUrl) &&
    Boolean(env.supabaseAnonKey) &&
    Boolean(env.supabaseServiceRoleKey),
  hasAiProvider: Boolean(env.openRouterApiKey || env.openAiApiKey),
  hasXProvider: Boolean(env.xBearerToken),
} as const;
