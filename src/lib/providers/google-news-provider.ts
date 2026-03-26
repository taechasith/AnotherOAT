import { sourcesConfig } from "@/src/config/sources";
import type { MentionProviderProgress } from "@/src/lib/providers/types";
import type { MentionProvider } from "@/src/lib/providers/types";
import type { MentionItem } from "@/src/lib/types";

const NEGATIVE_TH = ["ดราม่า", "วิจารณ์", "ถกเถียง", "ผิดหวัง", "แรง", "ข่าวลือ", "โจมตี", "แซะ"];
const NEGATIVE_EN = [
  "criticism",
  "controversy",
  "rumor",
  "backlash",
  "negative",
  "attack",
  "disappointed",
  "drama",
];

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value: string) {
  return decodeXml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickTagBucket(text: string) {
  const haystack = text.toLowerCase();
  const tags = new Set<string>();

  if (/ego|มั่นใจ|อีโก้/.test(haystack)) tags.add("ego");
  if (/confiden|มั่นใจ/.test(haystack)) tags.add("confidence");
  if (/rumor|ข่าวลือ|เมาท์|ลือ/.test(haystack)) tags.add("rumor");
  if (/misinformation|ข้อมูลผิด|บิดเบือน/.test(haystack)) tags.add("misinformation");
  if (/critic|วิจารณ์|ถกเถียง|ดราม่า/.test(haystack)) tags.add("accountability");
  if (/grow|mature|โตขึ้น|เติบโต|ทบทวน/.test(haystack)) tags.add("growth");
  if (/misread|เข้าใจผิด|ตีความผิด/.test(haystack)) tags.add("misreading");
  if (/image|ภาพลักษณ์|ภาพจำ/.test(haystack)) tags.add("public-image");
  if (/old|เก่า|ย้อน|อดีต/.test(haystack)) tags.add("old-narratives");
  if (/distance|ห่างเหิน|เย็นชา/.test(haystack)) tags.add("distance");
  if (/shift|เปลี่ยนมุมมอง|เปลี่ยนไป/.test(haystack)) tags.add("public-shift");
  if (tags.size === 0) tags.add("reflection");

  return [...tags];
}

function estimateNegativity(text: string) {
  const haystack = text.toLowerCase();
  let score = 0.3;

  for (const term of NEGATIVE_TH) {
    if (haystack.includes(term)) score += 0.08;
  }
  for (const term of NEGATIVE_EN) {
    if (haystack.includes(term)) score += 0.08;
  }

  return Math.max(0.05, Math.min(0.95, score));
}

function toFeedUrl(term: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(term)}&hl=th&gl=TH&ceid=TH:th`;
}

function extractItems(xml: string) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
}

function readTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

function createId(url: string, title: string) {
  const base = `${url}|${title}`;
  let hash = 0;
  for (let index = 0; index < base.length; index += 1) {
    hash = (hash * 31 + base.charCodeAt(index)) >>> 0;
  }
  return `google-${hash.toString(16)}`;
}

async function fetchQuery(query: string, emit?: (event: MentionProviderProgress) => void) {
  emit?.({
    phase: "querying",
    message: "กำลังค้นหาข่าวสาธารณะจาก Google News",
    detail: query,
    source: "google-news-rss",
  });

  const response = await fetch(toFeedUrl(query), {
    signal: AbortSignal.timeout(sourcesConfig.fetchLimits.timeoutMs),
    cache: "no-store",
  });

  const xml = await response.text();
  const items = extractItems(xml);
  const results: MentionItem[] = [];

  for (const item of items) {
    const title = stripTags(readTag(item, "title")).replace(/\s+-\s+[^-]+$/, "");
    const snippet = stripTags(readTag(item, "description"));
    const url = stripTags(readTag(item, "link"));
    const publishedAt = new Date(readTag(item, "pubDate") || Date.now()).toISOString();
    const source = stripTags(readTag(item, "source")) || "Google News";
    const combined = `${title} ${snippet}`;

    if (!/oat pramote|โอต ปราโมทย|โอ๊ต ปราโมทย/i.test(combined)) continue;

    results.push({
      id: createId(url, title),
      source,
      title,
      snippet,
      url,
      publishedAt,
      language: /[ก-๙]/.test(combined) ? "th" : "en",
      negativityScore: estimateNegativity(combined),
      tags: pickTagBucket(combined),
    });
  }

  emit?.({
    phase: "fetched",
    message: "ดึงผลลัพธ์จาก Google News แล้ว",
    detail: query,
    count: results.length,
    source: "google-news-rss",
  });

  return results;
}

export const googleNewsMentionProvider: MentionProvider = {
  id: "google-news-rss",
  async fetchMentions(options) {
    const emit = options?.emit;
    const queries = sourcesConfig.searchTerms.slice(0, sourcesConfig.fetchLimits.maxQueriesPerProvider);
    const settled = await Promise.allSettled(queries.map((query) => fetchQuery(query, emit)));

    return settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  },
};
