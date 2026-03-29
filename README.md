# another oat

Local-first reflective AI chat app for Oat Pramote. The initial build runs entirely in mock mode with no API keys, no paid services, and no always-on jobs. It is structured for easy deployment to Vercel and later upgrades to optional Supabase persistence or an AI provider.

## First Public Demo

This project was first demoed live at a public event on **29 March 2026**.

> 📺 Watch the debut: [https://www.youtube.com/live/VjN1tNoc-gs](https://www.youtube.com/live/VjN1tNoc-gs?si=w_eDdGnlY_xkr8kW)

The demo showcased the core reflection loop — live data ingestion, signal classification, and AI-driven conversation — running end-to-end from a single session start.

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Optional checks:

```bash
npm run typecheck
npm run build
```

## Vercel Deploy

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Add env vars only if you want Supabase or a real AI provider.
4. Deploy with the default Next.js settings.
5. Set `NEXT_PUBLIC_APP_URL` to your production URL after first deploy.

The app remains functional without secrets because it falls back to mock mentions, an in-memory session store, and a deterministic response engine.


The app uses the OpenAI Node SDK on the server and calls the Responses API. If `OPENAI_API_KEY` is missing, it automatically falls back to the built-in deterministic mock engine.

## Architecture Summary

- `app/`
  - App Router pages for `/`, `/chat`, `/timeline`, `/settings`
  - API routes for `/api/session-start`, `/api/chat`, `/api/mentions`
- `src/config/`
  - All editable product settings in one place
- `src/mock/`
  - Local seeded mentions and seeded conversation content
- `src/lib/providers/`
  - Mention provider pattern for cheap per-session ingestion
- `src/lib/stores/`
  - Memory store abstraction with a graceful local fallback
- `src/lib/chat/`
  - Chat engine abstraction with deterministic mock behavior by default

## Session Flow

1. User opens the landing page or starts chat.
2. `/api/session-start` fetches a bounded set of public mention summaries from enabled providers.
3. Mentions are normalized, deduplicated, filtered for relevance, and converted into a compact mind state.
4. `/chat` uses that mind state to condition grounded reflective responses.
5. The freshness window prevents repeated ingestion during short sessions.

## Centralized Editable Files

- `src/config/site.ts`
- `src/config/persona.ts`
- `src/config/sources.ts`
- `src/config/assets.ts`
- `src/mock/mentions.json`
- `src/mock/chat-seed.ts`
- `src/lib/env.ts`

Every user-editable area includes `TODO(user)` comments where appropriate.

## Deployment Notes

- Designed for Vercel serverless usage.
- No cron jobs.
- No background polling.
- Mention ingestion only runs on session start.
- Secrets stay server-side.
- Static placeholder assets prevent missing-file crashes during early setup.
