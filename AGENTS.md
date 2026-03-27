# AGENTS.md - Developer Guide for AnotherOAT

This file provides guidance for agentic coding agents operating in this repository.

## Project Overview

AnotherOAT is a local-first reflective AI chat app built with Next.js 16, TypeScript, and Tailwind CSS. It features a mock mode that works without API keys, with optional Supabase persistence and AI provider integration.

## Build Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server

# Quality Checks
npm run lint             # Run Next.js ESLint
npm run typecheck        # Run TypeScript type checking (tsc --noEmit)

# Testing
# Note: No test framework is currently configured. Tests would use Vitest/Jest.
# To run a single test file: npx vitest run src/lib/utils.test.ts
# Or add a test script to package.json if needed.
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **UI**: Radix UI (slot component), Lucide React icons, Framer Motion
- **Database**: Supabase (optional, with in-memory fallback)
- **AI**: OpenAI SDK with fallback mock engine

## Code Style Guidelines

### TypeScript

- Strict mode enabled in `tsconfig.json`
- Use explicit type annotations for function parameters and return types
- Avoid `any`; use `unknown` when type is uncertain
- Use `as const` for literal object values that shouldn't change
- Prefer `type` over `interface` for object shapes

### Imports

- Use path alias `@/*` for imports from project root (e.g., `@/lib/utils`)
- Order: external libraries → internal modules → local utils
- Group imports by blank lines: React/next → third-party → local

```typescript
// Good
import { useState } from "react";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
```

### Naming Conventions

- **Files**: kebab-case for configs (`next.config.ts`), PascalCase for components, camelCase for utilities
- **Types**: PascalCase with descriptive names (`MentionItem`, `SessionState`)
- **Variables**: camelCase; use descriptive names
- **Constants**: camelCase with `k` prefix for enum-like values, or SCREAMING_SNAKE for config
- **Components**: PascalCase, same name as file

### Components

- Use functional components with React Server Components where possible
- Client components marked with `'use client'` directive at top
- Co-locate small components with their parent
- Use `class-variance-authority` (cva) for component variants

```typescript
// Example component pattern
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base classes", {
  variants: {
    variant: {
      default: "variant classes",
      destructive: "destructive classes",
    },
    size: {
      default: "size classes",
      sm: "sm classes",
    },
  },
});

type ButtonProps = VariantProps<typeof buttonVariants> & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

### Error Handling

- Use `try/catch` with descriptive error messages
- Log errors with context for debugging
- Return meaningful error responses in API routes
- Use custom error types for domain-specific errors

### Tailwind CSS

- Use arbitrary values sparingly: `className="grid grid-cols-[1fr_300px]"`
- Use `@apply` in CSS layer for reusable utilities
- Combine classes with `cn()` utility from `@/lib/utils`
- Prefer semantic color names when possible

### API Routes

- Use Next.js Route Handlers (`app/api/*/route.ts`)
- Return JSON responses with appropriate status codes
- Handle both GET and POST methods in same file when needed
- Use `NextRequest`/`NextResponse` from `next/server`

### Environment Variables

- All env vars defined in `@/lib/env.ts`
- Client-side vars prefixed with `NEXT_PUBLIC_`
- Server-side only vars without prefix
- Use `featureFlags` for conditional feature enabling

### File Organization

```
app/                    # Next.js App Router pages and API routes
  api/                  # API endpoints
  (routes)/             # Page routes
src/
  config/               # Editable product settings (site, persona, sources)
  lib/                  # Core library code
    chat/               # Chat engine (mock + OpenAI)
    providers/          # Mention providers
    stores/             # Storage abstractions
    *.ts                # Utilities, types, env
  mock/                 # Mock data for offline mode
```

### Key Patterns

1. **Mention Provider**: `@/lib/providers/` - Pluggable provider pattern for fetching mentions
2. **Memory Store**: `@/lib/stores/memory-store.ts` - In-memory fallback with optional Supabase
3. **Chat Engine**: `@/lib/chat/` - Abstraction layer with mock engine default
4. **Config Files**: `@/src/config/` - Centralized editable settings with TODO(user) comments

## Working with Mock Mode

The app works without any API keys:
- No `OPENAI_API_KEY`: uses deterministic mock responses
- No `SUPABASE_*` vars: uses in-memory session store
- No provider tokens: uses mock provider with seeded data

## Common Tasks

### Adding a new config option
Edit files in `src/config/` - these are user-editable and have `TODO(user)` comments.

### Adding a new mention provider
1. Create provider in `src/lib/providers/`
2. Implement provider interface from `@/lib/providers/types.ts`
3. Add to provider registry in `src/lib/providers/index.ts`
4. Enable in `src/config/sources.ts`

### Adding a new API route
1. Create `app/api/<route>/route.ts`
2. Export handlers for HTTP methods
3. Add appropriate error handling and validation

### Modifying chat behavior
Edit `src/lib/chat/mock-engine.ts` for mock responses, or `src/lib/chat/openai-engine.ts` for AI.

## Linting & Type Checking

Always run before committing:

```bash
npm run lint
npm run typecheck
npm run build
```

## Dependencies

- **Do not add new dependencies without approval**
- If adding a package, verify it's compatible with Next.js serverless deployment
- Prefer lightweight alternatives to heavy libraries
