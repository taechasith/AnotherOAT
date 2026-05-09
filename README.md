# another oat: คุยกับอดีตของ โอ๊ต ปราโมทย์
เนื่องจากพี่โอ๊ตในวัย 41 ย่าง 42 ปี กำลังรู้สึก Burn Out / งั้นใครจะให้กำลังใจพี่โอ๊ตได้ นอกจากตัวเขาเองในอดีต เพื่อมาตอกย้ำว่าเขาเติบโตขึ้นมากแค่ไหน?

<img width="622" height="377" alt="image" src="https://github.com/user-attachments/assets/82714e28-2759-4640-a4e7-e11859eb323d" />

Your reflection begins here.

**another oat** is a reflection-first AI system that transforms public internet discourse into structured emotional context before conversation begins.

Built as an experimental experience around **โอ๊ต ปราโมทย์ (OAT Pramote)**, the system collects live public signals, analyzes tone, classifies meaning, and prepares a reflection-ready state so conversations are grounded in context, not reaction.

---

## First Public Demo

This project was first presented at **โคตรคูล LIVE**.

Watch here:  
https://www.youtube.com/live/VjN1tNoc-gs?si=w_eDdGnlY_xkr8kW

---

## What this is

Most AI systems respond instantly.

**another oat** does something different first.

Before any conversation begins, it:
<img width="883" height="569" alt="image" src="https://github.com/user-attachments/assets/b3b72fc7-719b-4358-b838-01ca25cd12b2" />
<img width="944" height="599" alt="image" src="https://github.com/user-attachments/assets/e4de1aec-f1ab-49e8-b301-e03be0c26d6d" />
- gathers what the internet is saying
- evaluates emotional tone
- separates meaningful signals from noise
- builds a structured reflection context

Only then does the conversation start.

This creates a space for **understanding before reacting**.

---

## Why it matters

Public figures do not only experience events.  
They experience interpretations of those events.

These interpretations include:

- fair criticism
- emotional reactions
- praise
- misinformation
- rumors
- distorted narratives
- hidden growth signals

Most platforms flatten all of this into a feed.

**another oat** is an attempt to rebuild that layer into something more thoughtful, where signals are interpreted, not just consumed.

---

## Core Features

### Reflection-first pipeline
Context is prepared before conversation begins.

### Live signal collection
Each session gathers fresh public data instead of relying only on static memory.

### Negativity scoring
Content is evaluated on a `0.0–1.0` scale to understand emotional intensity.

### Signal classification
Information is grouped into meaningful categories, not just listed.

### Mind-state derivation
The system builds a session-level interpretation of the overall situation.

### Persona-aware interaction
Responses are shaped by a consistent voice grounded in context.

---

## Signal Categories

The system organizes content into reflection-oriented groups:

- **Fair Criticism**  
  grounded, useful critique

- **Unfair Attack**  
  reactive or distorted negativity

- **Rumor**  
  unverified or weakly supported claims

- **Growth Signal**  
  insights that suggest learning or direction

---

## How it works

1. **Start session**  
   A session begins by collecting public signals.

2. **Analyze tone**  
   Each item is evaluated for emotional intensity.

3. **Classify meaning**  
   Signals are grouped into meaningful categories.

4. **Build context**  
   A reflection-ready state is created.

5. **Start conversation**  
   The system responds based on prepared context.

---

## Data Sources

Current concept includes:

- Google News RSS  
- X / API-based search (when available)  
- local fallback summaries for demo environments  

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 — App Router, static + dynamic routes, SSR |
| Language | TypeScript (strict) |
| UI | React 18, Tailwind CSS v4 (inline token design system) |
| Animation | Framer Motion — scroll reveals, stagger lists, ambient backgrounds |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) — scoring, classification, persona chat |
| Streaming | Server-Sent Events (SSE) — real-time session progress + chat response streaming |
| Data | Google News RSS, X Academic API (optional), local mock seed |
| Fonts | IBM Plex Sans Thai · Manrope · JetBrains Mono |
| Deployment | Vercel |

---

## Math & Scoring System

### Negativity Score

Each mention item is scored by Claude on a continuous scale:

$$s_i \in [0.0,\ 1.0]$$

`0.0` = fully positive or neutral. `1.0` = maximally negative.

---

### Session Average Negativity

$$\mu = \frac{\displaystyle\sum_{i=1}^{n} s_i}{\max(n,\ 1)}$$

Zero-division safe — denominator floored at 1 when no mentions exist.

---

### Emotional Weight Classification

$$W = \begin{cases} \text{heavy} & \mu > 0.65 \\ \text{moderate} & 0.45 < \mu \leq 0.65 \\ \text{light} & \mu \leq 0.45 \end{cases}$$

`W` drives the tone of every AI response in the session.

---

### Negativity Distribution (Histogram)

Mentions binned into four equal-width buckets:

| Bin | Range |
|---|---|
| Low | $0.00 \leq s < 0.25$ |
| Mild | $0.25 \leq s < 0.50$ |
| High | $0.50 \leq s < 0.75$ |
| Severe | $0.75 \leq s \leq 1.00$ |

Bar width per bin = $\dfrac{\text{bin count}}{\max(\text{all bin counts},\ 1)}$

---

### Signal Classification

Tag-based predicate matching — no threshold, no ML classifier:

| Category | Trigger tags |
|---|---|
| Fair Criticism | `accountability`, `distance`, `ego` |
| Unfair Attack | `projection`, `public-image`, `cruelty`, `misreading` |
| Rumor | `rumor`, `misinformation` |
| Growth Signal | `growth`, `public-shift` |

Each category extracts up to 4 unique themes from matching mentions.

---

### Age Derivation

$$\text{age} = \left\lfloor \frac{t_\text{ref} - t_\text{birth}}{365.25} \right\rfloor$$

$t_\text{ref}$ = `deathDate` if set, otherwise `Date.now()`.  
This means `getCurrentAge()` always returns age-at-death once `deathDate` is defined.

---

### Auto Data Range

Default year window used by every session and analysis page:

$$y_\text{end} = \begin{cases} y_\text{death} & \text{if } \texttt{deathDate} \neq \texttt{null} \\ y_\text{current} & \text{otherwise} \end{cases}$$

$$y_\text{start} = \max\!\left(y_\text{birth} + 18,\ y_\text{end} - 6\right)$$

Floor at birth+18 excludes pre-adult data. Window auto-advances each calendar year while alive.

---

## Core Idea

This project is built on a simple shift:

> Don’t respond immediately.  
> Understand first.

---

## Product Principles

- context before conversation  
- signal over noise  
- reflection over reaction  
- interpretation over aggregation  
- clarity over speed  

---

## Use Cases

- public figure reflection tools  
- discourse analysis systems  
- narrative mapping  
- emotionally aware AI interfaces  
- experimental HCI projects  
- media literacy and criticism exploration  

---

## Design Direction

The experience should feel:

- calm, not reactive  
- structured, not chaotic  
- reflective, not performative  

Users should be able to:

- see how signals are formed  
- understand why something matters  
- decide what deserves attention  

---

## Ethics

This system deals with real people, public discourse, and emotional interpretation.

Important considerations:

- fairness in classification  
- avoiding amplification of harm  
- separating rumor from verified signals  
- acknowledging uncertainty  
- responsible use of persona-based generation  

---

## Project Status

Experimental prototype.

Currently demonstrates:

- session-based signal collection  
- real-time context preparation  
- negativity scoring  
- signal classification  
- reflection-driven conversation  

---

## Website

https://oat.creativelabth.com

---

## Credits

Created in 3 days by
- Taechasith Kangkhuntod (CreativeLabTH Group): Project Architecture, Mind State Engine, Animation System, UI/UX Design, Landing Page, Analysis Dashboard, Configuration System, AI Content & Persona Writing, Release Management
- Poowadol Thontra (Harbour.Space@UTCC): API Integration and User Data Structures
- Akarapong Thammawong (CreativeLabTH Group): Website Domain and Optimization
