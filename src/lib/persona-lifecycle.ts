import { siteConfig } from "@/src/config/site";

export function getBirthYear(): number {
  return new Date(siteConfig.birthDate).getUTCFullYear();
}

export function getDeathYear(): number | null {
  return siteConfig.deathDate ? new Date(siteConfig.deathDate).getUTCFullYear() : null;
}

export function isAlive(): boolean {
  return siteConfig.deathDate === null;
}

/** Age today, or age at time of death if deathDate is set. */
export function getCurrentAge(): number {
  const birth = new Date(siteConfig.birthDate);
  const ref = siteConfig.deathDate ? new Date(siteConfig.deathDate) : new Date();
  return Math.floor((ref.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function getAgeAtYear(year: number): number {
  return year - getBirthYear();
}

/**
 * Default year range for data pulls and analysis UI.
 * endYear = death year if dead, else current year.
 * startYear = 6 years before endYear, floored at birth+18.
 */
export function getDefaultDataRange(): { startYear: number; endYear: number } {
  const birthYear = getBirthYear();
  const deathYear = getDeathYear();
  const currentYear = new Date().getUTCFullYear();
  const endYear = deathYear ?? currentYear;
  const startYear = Math.max(birthYear + 18, endYear - 6);
  return { startYear, endYear };
}

/**
 * Ordered list of valid years (newest first) for year-picker dropdowns.
 * Upper bound: death year or current year. Lower bound: birth + 18.
 */
export function getValidYears(): number[] {
  const birthYear = getBirthYear();
  const deathYear = getDeathYear();
  const currentYear = new Date().getUTCFullYear();
  const endYear = deathYear ?? currentYear;
  const startYear = birthYear + 18;
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
}
