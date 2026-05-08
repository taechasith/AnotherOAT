"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "th";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "th" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return TRANSLATIONS[lang];
}

// ─── Translations ────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    nav: { home: "Home", reflect: "Reflect", insights: "Insights" },
    header: { subtitle: "Personal Reflection Engine" },
    hero: {
      badge: "Personal Reflection Engine",
      tagline: "Your reflection",
      taglineAccent: "begins here.",
      description: "Talk to your past self to understand who you are today.",
      startSession: "Start Session",
      enterWorkspace: "Enter Workspace",
      preparing: "Preparing data...",
      exploreFirst: "Explore Insights",
      exploreFirstSub: "Pick age range & data size — shapes your chat context",
      chatNow: "Chat with Oat",
      chatNowSub: "Uses Oat at current age, no setup needed",
    },
    chat: {
      readyPill: "OAT is ready to reflect",
      emptyHint: "Context is ready — start with whatever is on your mind",
      you: "YOU",
      typing: "Typing...",
      placeholder: "Reflect on your day...",
      quickChips: ["Deep Reflection", "Goal Alignment", "Emotional Check-in"],
      retry: "Retry",
    },
    sidebar: {
      session: "Session",
      refreshSignals: "Refresh Signals",
      refreshing: "Refreshing...",
    },
    insight: {
      emotionalState: "Emotional state",
      validCriticism: "Valid criticism",
      invalidAttacks: "Invalid attacks",
      unclearRumors: "Unclear rumors",
      growthSignals: "Growth signals",
      nextActions: "Next reflection actions",
      noData: "No data yet",
      noCriticism: "No significant criticism identified",
      noAttacks: "No notable attacks detected",
      noRumors: "No circulating rumors found",
      noGrowth: "No prominent growth signals yet",
    },
    session: {
      liveCollection: "Live Data Collection",
      collecting: "Collecting & Classifying Your Data",
      description:
        "The system is pulling data from multiple sources, analyzing tone, and classifying signals to prepare context for conversation.",
      live: "Live",
      ready: "Ready",
      realtimePopulation: "Realtime event population",
      realtimeNote: "Items collected during each phase of the process",
      negativityDist: "Negativity distribution",
      negativityNote: "Distribution of content tone — how much is negative",
      timelineDensity: "Timeline density",
      timelineNote: "Data density across time periods",
      sourceDist: "Source distribution",
      noDataYet: "Charts will appear in real-time when the session starts",
      noEnoughData: "Not enough data yet",
    },
    analysis: {
      label: "Internet Data Analysis",
      title: "Insights",
      description:
        "See what data exists about Oat, how much there is, and how it is classified — fair criticism, attacks, rumors, or growth signals.",
      live: "Live",
      lastUpdated: "Last updated",
      totalItems: "Total items",
      avgNegativity: "Avg. negativity",
      providersEnabled: "Providers enabled",
      mindState: "Mind state",
      negativityDist: "Negativity Distribution",
      timelineDensity: "Timeline Density by Age",
      sourceDist: "Source Distribution",
      validCriticism: "Valid Criticism",
      invalidAttacks: "Invalid Attacks",
      unclearRumors: "Unclear Rumors",
      growthSignals: "Growth Signals",
      noCriticism: "No significant criticism identified",
      noAttacks: "No notable attacks detected",
      noRumors: "No circulating rumors found",
      noGrowth: "No prominent growth signals yet",
      dataSources: "Data Sources",
      active: "Active",
      inactive: "Inactive",
      rawItems: "Raw items",
      dataRecords: "Data Records",
      source: "Source",
      titleCol: "Title",
      date: "Date",
      negativity: "Negativity",
      tags: "Tags",
      externalSource: "External source",
      localFallback: "Local fallback",
      needsCredentials: "Needs credentials",
      fromYear: "From Year",
      toYear: "To Year",
      maxItemsLabel: "Max Items",
      agePrefix: "age",
      loading: "Loading...",
      refreshData: "Refresh Data",
      archiveMode: "Archive Mode",
      archiveBanner: "Preserved archive — data ends at the time Oat passed. No new data can be fetched.",
      filterNote: "Select year range and item count, then click Refresh Data to reload with new filters.",
      archiveNote: "Data in the archive has ended. Year filtering is available but no new data can be fetched.",
    },
    about: {
      label: "About This Project",
      title: "Another OAT: Talk to the Past of Oat Pramote",
      desc1: "A space to converse with a reflection of",
      desc1name: "Oat Pramote",
      desc1end:
        ", Thai singer and entertainer, through real data that the internet has recorded.",
      desc2:
        "The system does not just display text from the internet — it classifies, analyzes, and prepares honest context before every conversation, so you can distinguish what deserves attention from what should be let go.",
      startChat: "Start Chatting",
      signalCategories: "Signal categories",
      dataSources: "Data sources",
      personaProfile: "Persona profile",
      howItWorks: "How It Works",
      howTitle: "Three simple steps",
      theScience: "The Science",
      scienceTitle: "The logic behind the system",
      scienceSubtitle:
        "Every step of the process is designed to be transparent and auditable.",
      steps: [
        {
          step: "01",
          title: "Start a Session",
          description:
            'Press "Start Session" — the system pulls fresh data from the internet, analyzes tone, and prepares full context before opening conversation. Takes a few seconds.',
        },
        {
          step: "02",
          title: "Explore Insights",
          description:
            "See what the world is saying about Oat, which signals deserve attention, which criticism is fair, and what is just noise.",
        },
        {
          step: "03",
          title: "Start Conversation",
          description:
            "Chat with an AI that understands context. Ask what you are curious about, explore the past, or test how much weight a criticism actually carries.",
        },
      ],
      science: [
        {
          title: "Negativity Scoring",
          description:
            "Each item from the internet is scored 0.0–1.0 to measure its level of negative content, before being classified in the next step.",
        },
        {
          title: "4-Category Signal Classification",
          description:
            "Fair criticism · Unfair attacks · Rumors · Growth signals — all four categories separated by the system before every session.",
        },
        {
          title: "Mind State Derivation",
          description:
            'The system combines all signals to derive the current "mind state," which determines the direction and tone of every response.',
        },
        {
          title: "Persona-Driven Voice",
          description:
            "Every response is grounded in Oat's actual persona profile, ensuring the voice reflects his real experience and perspective.",
        },
      ],
    },
    evidence: {
      sessionOverview: "Session Overview",
      sessionTitle: "Data collected, classified, and ready for conversation",
      sessionDesc:
        "Each session pulls data about Oat from the internet, analyzes content tone, and groups it into clear signals before opening the conversation space.",
      dataPoints: "Data points",
      signalTypes: "Signal types",
      collectionMode: "Collection mode",
      liveOnStart: "Live on session start",
      dataSources: "Data Sources",
      externalSource: "External source",
      localFallback: "Local fallback",
      active: "Active",
      inactive: "Inactive",
      needsCredentials: "Needs credentials",
      footerNote:
        "Google News RSS and local seed are available immediately. X.com activates when valid credentials are provided.",
    },
  },

  th: {
    nav: { home: "หน้าแรก", reflect: "สนทนา", insights: "วิเคราะห์" },
    header: { subtitle: "เครื่องมือสะท้อนความคิด" },
    hero: {
      badge: "เครื่องมือสะท้อนความคิด",
      tagline: "การสะท้อนตัวเองของคุณ",
      taglineAccent: "เริ่มต้นที่นี่",
      description: "คุยกับตัวเองในอดีต เพื่อทำความเข้าใจตัวเองในปัจจุบัน",
      startSession: "เริ่มเซสชัน",
      enterWorkspace: "เข้าสู่พื้นที่ทำงาน",
      preparing: "กำลังเตรียมข้อมูล...",
      exploreFirst: "ดูข้อมูลวิเคราะห์ก่อน",
      exploreFirstSub: "เลือกช่วงอายุและขนาดข้อมูล เพื่อปรับบริบทการสนทนา",
      chatNow: "สนทนากับโอ๊ตเลย",
      chatNowSub: "ใช้ข้อมูลโอ๊ตตามอายุปัจจุบัน ไม่ต้องตั้งค่า",
    },
    chat: {
      readyPill: "โอ๊ตพร้อมสนทนาแล้ว",
      emptyHint: "บริบทพร้อมแล้ว — เริ่มจากสิ่งที่ยังค้างอยู่ในใจ",
      you: "คุณ",
      typing: "กำลังพิมพ์...",
      placeholder: "บอกสิ่งที่อยู่ในใจ...",
      quickChips: ["ทบทวนลึก", "เป้าหมาย", "เช็คความรู้สึก"],
      retry: "ลองใหม่",
    },
    sidebar: {
      session: "เซสชัน",
      refreshSignals: "รีเฟรชข้อมูล",
      refreshing: "กำลังรีเฟรช...",
    },
    insight: {
      emotionalState: "สภาวะอารมณ์",
      validCriticism: "คำวิจารณ์ที่ยุติธรรม",
      invalidAttacks: "การโจมตีที่ไม่เป็นธรรม",
      unclearRumors: "ข่าวลือ",
      growthSignals: "สัญญาณการเติบโต",
      nextActions: "สิ่งที่ควรทำต่อ",
      noData: "ยังไม่มีข้อมูล",
      noCriticism: "ไม่พบคำวิจารณ์ที่มีนัยสำคัญ",
      noAttacks: "ไม่พบการโจมตีที่น่าสนใจ",
      noRumors: "ไม่พบข่าวลือที่แพร่กระจาย",
      noGrowth: "ยังไม่พบสัญญาณการเติบโตที่ชัดเจน",
    },
    session: {
      liveCollection: "การดึงข้อมูลสด",
      collecting: "กำลังเก็บและจำแนกข้อมูล",
      description:
        "ระบบกำลังดึงข้อมูลจากแหล่งต่าง ๆ วิเคราะห์โทนเนื้อหา และจัดกลุ่มสัญญาณ เพื่อเตรียมบริบทสำหรับการสนทนา",
      live: "สด",
      ready: "พร้อม",
      realtimePopulation: "จำนวนรายการแบบเรียลไทม์",
      realtimeNote: "จำนวนรายการที่ดึงได้สะสมในแต่ละช่วงของกระบวนการ",
      negativityDist: "การกระจายเนื้อหาเชิงลบ",
      negativityNote: "การกระจายของโทนเนื้อหา — มากแค่ไหนที่เป็นเชิงลบ",
      timelineDensity: "ความหนาแน่นตามช่วงเวลา",
      timelineNote: "ความหนาแน่นของข้อมูลตามช่วงเวลา",
      sourceDist: "แหล่งข้อมูล",
      noDataYet: "กราฟจะแสดงแบบเรียลไทม์เมื่อเซสชันเริ่มต้น",
      noEnoughData: "ยังไม่มีข้อมูลเพียงพอ",
    },
    analysis: {
      label: "วิเคราะห์ข้อมูลอินเทอร์เน็ต",
      title: "ข้อมูลเชิงลึก",
      description:
        "ดูว่ามีข้อมูลอะไรเกี่ยวกับโอ้ตบ้าง มากแค่ไหน และถูกจำแนกอย่างไร — คำวิจารณ์ที่ยุติธรรม การโจมตี ข่าวลือ หรือสัญญาณการเติบโต",
      live: "สด",
      lastUpdated: "อัปเดตล่าสุด",
      totalItems: "รายการทั้งหมด",
      avgNegativity: "ค่าเฉลี่ยเชิงลบ",
      providersEnabled: "แหล่งที่เปิดใช้",
      mindState: "สภาวะใจ",
      negativityDist: "การกระจายเชิงลบ",
      timelineDensity: "ความหนาแน่นตามอายุ",
      sourceDist: "การกระจายแหล่งข้อมูล",
      validCriticism: "คำวิจารณ์ที่ยุติธรรม",
      invalidAttacks: "การโจมตีที่ไม่เป็นธรรม",
      unclearRumors: "ข่าวลือ",
      growthSignals: "สัญญาณการเติบโต",
      noCriticism: "ไม่พบคำวิจารณ์ที่มีนัยสำคัญ",
      noAttacks: "ไม่พบการโจมตีที่น่าสนใจ",
      noRumors: "ไม่พบข่าวลือที่แพร่กระจาย",
      noGrowth: "ยังไม่พบสัญญาณการเติบโตที่ชัดเจน",
      dataSources: "แหล่งข้อมูล",
      active: "ใช้งานอยู่",
      inactive: "ไม่ได้ใช้งาน",
      rawItems: "ข้อมูลดิบ",
      dataRecords: "ชุดข้อมูล",
      source: "แหล่ง",
      titleCol: "หัวข้อ",
      date: "วันที่",
      negativity: "เชิงลบ",
      tags: "แท็ก",
      externalSource: "แหล่งภายนอก",
      localFallback: "ข้อมูลสำรอง",
      needsCredentials: "ต้องการข้อมูลยืนยัน",
      fromYear: "จากปี",
      toYear: "ถึงปี",
      maxItemsLabel: "จำนวนสูงสุด",
      agePrefix: "อายุ",
      loading: "กำลังโหลด...",
      refreshData: "รีเฟรชข้อมูล",
      archiveMode: "โหมดคลังข้อมูล",
      archiveBanner: "คลังข้อมูลเก็บรักษา — ข้อมูลทั้งหมดสิ้นสุด ณ วันที่โอ๊ตจากไป ไม่มีการดึงข้อมูลใหม่",
      filterNote: "เลือกช่วงปีและจำนวนรายการ แล้วกด รีเฟรชข้อมูล เพื่อโหลดใหม่ตามเงื่อนไขที่กำหนด",
      archiveNote: "ข้อมูลในคลังสิ้นสุดแล้ว สามารถกรองตามช่วงปีได้แต่ไม่สามารถดึงข้อมูลใหม่ได้",
    },
    about: {
      label: "เกี่ยวกับโปรเจกต์นี้",
      title: "Another OAT: คุยกับอดีตของ โอ๊ต ปราโมทย์",
      desc1: "พื้นที่ที่ให้คุณสนทนากับภาพสะท้อนของ",
      desc1name: "โอ๊ต ปราโมทย์",
      desc1end: " นักแสดงและศิลปินชาวไทย ผ่านข้อมูลจริงที่โลกออนไลน์บันทึกไว้",
      desc2:
        "ระบบไม่ได้แค่แสดงข้อความจากอินเทอร์เน็ต แต่จำแนก วิเคราะห์ และเตรียมบริบทที่ซื่อสัตย์ก่อนทุกบทสนทนา เพื่อให้คุณแยกแยะได้ว่าอะไรคือเสียงที่ควรฟัง และอะไรที่ควรปล่อยผ่าน",
      startChat: "เริ่มสนทนาเลย",
      signalCategories: "หมวดสัญญาณ",
      dataSources: "แหล่งข้อมูล",
      personaProfile: "โปรไฟล์ตัวตน",
      howItWorks: "วิธีใช้งาน",
      howTitle: "สามขั้นตอนง่าย ๆ",
      theScience: "หลักการ",
      scienceTitle: "ตรรกะเบื้องหลังระบบ",
      scienceSubtitle: "กระบวนการทำงานทุกขั้นตอนออกแบบให้โปร่งใสและสามารถตรวจสอบได้",
      steps: [
        {
          step: "01",
          title: "เริ่มเซสชัน",
          description:
            'กด "เริ่มเซสชัน" ระบบจะดึงข้อมูลสดจากอินเทอร์เน็ต วิเคราะห์โทนเนื้อหา และเตรียมบริบทครบถ้วนก่อนเปิดบทสนทนา ใช้เวลาไม่กี่วินาที',
        },
        {
          step: "02",
          title: "สำรวจข้อมูลเชิงลึก",
          description:
            "ดูว่าโลกพูดถึงโอ๊ตอย่างไร สัญญาณไหนที่ควรรับฟัง คำวิจารณ์ไหนที่ยุติธรรม และอะไรที่เป็นเพียงเสียงรบกวน",
        },
        {
          step: "03",
          title: "เริ่มบทสนทนา",
          description:
            "พูดคุยกับ AI ที่เข้าใจบริบท ถามในสิ่งที่สงสัย สำรวจสิ่งที่ผ่านมา หรือทดสอบว่าคำวิจารณ์นั้นมีน้ำหนักจริงแค่ไหน",
        },
      ],
      science: [
        {
          title: "Negativity Scoring",
          description:
            "แต่ละรายการจากอินเทอร์เน็ตถูกให้คะแนน 0.0–1.0 เพื่อวัดระดับเนื้อหาเชิงลบ ก่อนนำไปจำแนกในขั้นถัดไป",
        },
        {
          title: "4-Category Signal Classification",
          description:
            "คำวิจารณ์ที่ยุติธรรม · การโจมตีที่ไม่เป็นธรรม · ข่าวลือ · สัญญาณการเติบโต ทั้งสี่หมวดถูกคัดแยกโดยระบบก่อนทุกเซสชัน",
        },
        {
          title: "Mind State Derivation",
          description:
            'ระบบรวมสัญญาณทั้งหมดเพื่อสรุป "สภาวะใจ" ปัจจุบัน ซึ่งกำหนดทิศทางและน้ำเสียงของการตอบสนอง',
        },
        {
          title: "Persona-Driven Voice",
          description:
            "การตอบทุกครั้งอ้างอิงโปรไฟล์ตัวตนจริงของโอ๊ตเป็นหลัก เพื่อให้น้ำเสียงสะท้อนประสบการณ์และมุมมองที่แท้จริง",
        },
      ],
    },
    evidence: {
      sessionOverview: "ภาพรวมเซสชัน",
      sessionTitle: "ข้อมูลที่เก็บได้ ถูกจำแนก และพร้อมสำหรับการสนทนา",
      sessionDesc:
        "แต่ละเซสชันดึงข้อมูลเกี่ยวกับโอ๊ตจากอินเทอร์เน็ต วิเคราะห์โทนเนื้อหา และจัดกลุ่มเป็นสัญญาณที่ชัดเจน ก่อนเปิดพื้นที่สนทนา",
      dataPoints: "จุดข้อมูล",
      signalTypes: "ประเภทสัญญาณ",
      collectionMode: "รูปแบบการเก็บ",
      liveOnStart: "สดเมื่อเริ่มเซสชัน",
      dataSources: "แหล่งข้อมูล",
      externalSource: "แหล่งภายนอก",
      localFallback: "ข้อมูลสำรอง",
      active: "ใช้งานอยู่",
      inactive: "ไม่ได้ใช้งาน",
      needsCredentials: "ต้องการข้อมูลยืนยัน",
      footerNote:
        "Google News RSS และ local seed พร้อมใช้งานทันที X.com จะเปิดใช้เมื่อได้รับ credentials ที่ถูกต้อง",
    },
  },
} as const;

export type Translations = typeof TRANSLATIONS.en;
