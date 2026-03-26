import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const personaProfilePath = path.join(process.cwd(), "content", "persona", "oat-pramote.md");

export type PersonaSection = {
  heading: string;
  body: string;
  bullets: string[];
};

export type PersonaDossier = {
  raw: string;
  title: string | null;
  sections: PersonaSection[];
  dialogueStyle: string[];
  emotion: string[];
  voice: string[];
  personality: string[];
  motivation: string[];
  knowledge: string[];
  goals: string[];
  core: string[];
  flaws: string[];
};

async function readPersonaProfile() {
  try {
    const content = await readFile(personaProfilePath, "utf8");
    return content.trim();
  } catch {
    return "";
  }
}

const readCachedPersonaProfile = cache(readPersonaProfile);

function normalizeHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_:#()]/g, "")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isBullet(line: string) {
  return /^[-*]\s+/.test(line);
}

function cleanBullet(line: string) {
  return line.replace(/^[-*]\s+/, "").trim();
}

function parseSections(raw: string) {
  const lines = raw.split(/\r?\n/);
  const sections: PersonaSection[] = [];
  let current: PersonaSection | null = null;

  for (const originalLine of lines) {
    const line = originalLine.trim();

    if (line.startsWith("# ")) {
      continue;
    }

    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = {
        heading: line.replace(/^##\s+/, "").trim(),
        body: "",
        bullets: [],
      };
      continue;
    }

    if (!current) {
      continue;
    }

    if (isBullet(line)) {
      current.bullets.push(cleanBullet(line));
      continue;
    }

    if (line.length === 0) {
      continue;
    }

    current.body = current.body ? `${current.body}\n${line}` : line;
  }

  if (current) sections.push(current);
  return sections;
}

function pickSection(sections: PersonaSection[], patterns: string[]) {
  return sections.find((section) => {
    const heading = normalizeHeading(section.heading);
    return patterns.some((pattern) => heading.includes(pattern));
  });
}

function valuesOf(section: PersonaSection | undefined) {
  if (!section) return [];
  const values = [...section.bullets];
  if (section.body) values.push(section.body);
  return values.filter(Boolean);
}

function parseTitle(raw: string) {
  const line = raw.split(/\r?\n/).find((item) => item.trim().startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : null;
}

function buildDossier(raw: string): PersonaDossier {
  const sections = parseSections(raw);

  return {
    raw,
    title: parseTitle(raw),
    sections,
    dialogueStyle: valuesOf(pickSection(sections, ["dialogue style", "สไตล์การสนทนา"])),
    emotion: valuesOf(pickSection(sections, ["emotion", "อารมณ์"])),
    voice: valuesOf(pickSection(sections, ["voice", "น้ำเสียง"])),
    personality: valuesOf(pickSection(sections, ["personality", "บุคลิก"])),
    motivation: valuesOf(pickSection(sections, ["motivation", "แรงจูงใจ"])),
    knowledge: valuesOf(pickSection(sections, ["knowledge", "ความรู้"])),
    goals: valuesOf(pickSection(sections, ["goal", "เป้าหมาย"])),
    core: valuesOf(pickSection(sections, ["core description", "แก่นของตัวละคร"])),
    flaws: valuesOf(pickSection(sections, ["flaw", "จุดอ่อน"])),
  };
}

export async function getPersonaProfile() {
  if (process.env.NODE_ENV === "development") {
    return readPersonaProfile();
  }

  return readCachedPersonaProfile();
}

export async function getPersonaDossier() {
  return buildDossier(await getPersonaProfile());
}

export function formatPersonaDossier(dossier: PersonaDossier) {
  if (!dossier.raw) {
    return "No persona file content found.";
  }

  const blocks = [
    dossier.title ? `Title:\n${dossier.title}` : null,
    dossier.core.length ? `Core identity and flaws:\n- ${[...dossier.core, ...dossier.flaws].join("\n- ")}` : null,
    dossier.motivation.length ? `Motivations:\n- ${dossier.motivation.join("\n- ")}` : null,
    dossier.dialogueStyle.length ? `Dialogue style:\n- ${dossier.dialogueStyle.join("\n- ")}` : null,
    dossier.emotion.length ? `Emotional register:\n- ${dossier.emotion.join("\n- ")}` : null,
    dossier.voice.length ? `Voice:\n- ${dossier.voice.join("\n- ")}` : null,
    dossier.personality.length ? `Personality:\n- ${dossier.personality.join("\n- ")}` : null,
    dossier.knowledge.length ? `Knowledge and interests:\n- ${dossier.knowledge.join("\n- ")}` : null,
    dossier.goals.length ? `Chat goals:\n- ${dossier.goals.join("\n- ")}` : null,
  ].filter(Boolean);

  return blocks.join("\n\n");
}

export function personaFallbackLine(dossier: PersonaDossier) {
  return (
    dossier.voice[0] ??
    dossier.personality[0] ??
    dossier.dialogueStyle[0] ??
    dossier.goals[0] ??
    dossier.motivation[0] ??
    "คุยแบบเป็นธรรมชาติและตรงกับบุคลิกจาก persona file"
  );
}

export function getPersonaProfilePath() {
  return personaProfilePath;
}
