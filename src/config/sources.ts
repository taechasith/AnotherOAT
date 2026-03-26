export const sourcesConfig = {
  searchTerms: [
    "โอต ปราโมทย",
    "Oat Pramote",
    "โอ๊ต ปราโมทย",
    "\"โอต\" ปราโมทย",
    "\"Oat\" \"Pramote\"",
  ],
  fetchLimits: {
    maxItemsPerSession: 20,
    maxProvidersPerSession: 2,
    maxQueriesPerProvider: 2,
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
      id: "mock-public-summaries",
      label: "Mock public summaries",
      enabled: true,
      type: "mock",
    },
  ],
  // TODO(user): Adjust search terms, session limits, and providers here.
} as const;
