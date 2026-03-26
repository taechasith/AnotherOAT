import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const personaProfilePath = path.join(process.cwd(), "content", "persona", "oat-pramote.md");

async function readPersonaProfile() {
  try {
    const content = await readFile(personaProfilePath, "utf8");
    return content.trim();
  } catch {
    return "";
  }
}

const readCachedPersonaProfile = cache(readPersonaProfile);

export async function getPersonaProfile() {
  if (process.env.NODE_ENV === "development") {
    return readPersonaProfile();
  }

  return readCachedPersonaProfile();
}

export function getPersonaProfilePath() {
  return personaProfilePath;
}
