export const sourcesConfig = {
  searchTerms: [
    "โอต ปราโมทย",
    "โอ๊ต ปราโมทย",
    "Oat Pramote",
    "โอต ปราโมทย วิจารณ์",
    "โอต ปราโมทย ดราม่า",
    "โอต ปราโมทย ข่าวลือ",
    "Oat Pramote criticism",
    "Oat Pramote controversy",
  ],
  fetchLimits: {
    maxItemsPerSession: 40,
    maxProvidersPerSession: 2,
    maxQueriesPerProvider: 5,
    timeoutMs: 3500,
  },
  sessionStartIngestionEnabled: true,
  providerList: [
    {
      id: "google-news-rss",
      label: "Google News RSS",
      enabled: true,
      type: "remote",
    },
    {
      id: "x-academic-search",
      label: "X Academic / API search",
      enabled: false,
      type: "remote",
    },
    {
      id: "mock-public-summaries",
      label: "Mock public summaries",
      enabled: true,
      type: "mock",
    },
  ],
  // TODO(user): Adjust search terms, session limits, and providers here.
} as const;
