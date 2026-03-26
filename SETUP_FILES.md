# SETUP_FILES

This project already runs in local mock mode without any extra setup. The files and values below are only needed when you want to replace placeholders or enable optional production features.

## Files To Upload Later

Upload these exact files if you want the app to replace placeholders automatically:

- `public/avatars/oat-avatar.png`
- `public/logos/another-oat-logo.svg`
- `public/logos/another-oat-logo.png`
- `public/graphics/hero-noise.png`
- `public/graphics/ambient-glow.png`

Optional extra assets:

- `public/uploads/` for ad hoc user-provided files during local experimentation

## Config Files You Can Edit Directly

- `src/config/site.ts`
  - `TODO(user)`: deployment URL, theme defaults
- `src/config/persona.ts`
  - `TODO(user)`: persona instruction, tone settings, safety rules, starter prompts
- `src/config/sources.ts`
  - `TODO(user)`: search terms, fetch limits, provider toggles
- `src/config/assets.ts`
  - `TODO(user)`: paths if you choose different filenames

## Optional Environment Variables

No environment variables are required for local mock mode.

Optional:

- `NEXT_PUBLIC_APP_URL`
  - Public app URL used for production links
- `NEXT_PUBLIC_SUPABASE_URL`
  - Enables optional Supabase-backed persistence flow later
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Supabase client key
- `SUPABASE_SERVICE_ROLE_KEY`
  - Server-side Supabase service key
- `OPENAI_API_KEY`
  - Enables a real AI response engine now
- `OPENAI_MODEL`
  - Optional model override, default is `gpt-5.4`
- `MENTIONS_API_KEY`
  - Reserved for an external mentions or search provider later

## Still Placeholder Right Now

- Real Oat avatar image
- Real logo
- Decorative production graphics
- Real public mention provider integration
- Real AI provider integration
- Real Supabase schema and persistence implementation

## Suggested Next Replacement Order

1. Upload `public/avatars/oat-avatar.png`
2. Upload `public/logos/another-oat-logo.svg`
3. Replace mock mentions in `src/mock/mentions.json` or enable a real provider
4. Add optional env vars in Vercel if you want persistence or a live model
