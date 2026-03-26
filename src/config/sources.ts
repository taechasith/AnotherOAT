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
    timeoutMs: 5000,
  },
  sessionStartIngestionEnabled: true,
  providerList: [
    {
      id: "mock-public-summaries",
      label: "Mock public summaries",
      enabled: true,
      type: "mock",
    },
    {
      id: "public-search-summary",
      label: "Public search summary provider",
      enabled: false,
      type: "remote",
    },
  ],
  // TODO(user): Adjust search terms, session limits, and providers here.
} as const;
