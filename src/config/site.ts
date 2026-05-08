export const siteConfig = {
  name: "another oat",
  shortDescription:
    "พื้นที่สนทนาเพื่อทบทวนตัวเอง ที่ให้ความเจ็บปวด คำวิจารณ์ และการเติบโต อยู่ร่วมกันได้อย่างอ่อนโยน",
  deploymentUrl: "https://your-vercel-project-url.vercel.app",
  theme: {
    defaultTheme: "dark",
    enableSystem: true,
  },
  birthDate: "1984-12-09",
  // Set to "YYYY-MM-DD" when Oat passes — all year ranges, data pulls, and UI
  // mode (live vs archive) derive from this single field automatically.
  deathDate: null as string | null,
  freshnessWindowMs: 1000 * 60 * 12,
  exportFileName: "another-oat-reflection-th.txt",
  // TODO(user): Replace the deployment URL after you connect the app to Vercel.
} as const;
