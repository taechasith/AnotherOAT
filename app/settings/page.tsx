import { AppShell } from "@/components/app-shell";
import { MotionWrapper } from "@/components/motion-wrapper";
import { assetsConfig } from "@/src/config/assets";
import { personaConfig } from "@/src/config/persona";
import { sourcesConfig } from "@/src/config/sources";
import { getPersonaProfile, getPersonaProfilePath } from "@/src/lib/chat/persona-profile";

export default async function SettingsPage() {
  const personaProfile = await getPersonaProfile();

  return (
    <AppShell eyebrow="Configuration">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        <MotionWrapper className="rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-4 shadow-glow backdrop-blur-xl sm:p-6 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-xs">Settings</p>
          <h1 className="mt-1.5 font-serif text-2xl text-white sm:text-3xl md:text-4xl">ค่าตั้งต้นทั้งหมดแก้ไขได้จากไฟล์ config</h1>
          <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SettingsCard
              title="Persona Profile"
              body={personaProfile || "(no persona file found)"}
              footer={getPersonaProfilePath()}
            />
            <SettingsCard
              title="Data Sources"
              body={sourcesConfig.searchTerms.join(", ")}
              footer={`Active providers: ${sourcesConfig.providerList.filter((item) => item.enabled).length}`}
            />
            <SettingsCard
              title="AI Framework"
              body={personaConfig.frameworkInstruction}
              footer={`Starter prompts: ${personaConfig.defaultStarterPrompts.length}`}
            />
            <SettingsCard
              title="Asset Paths"
              body={[assetsConfig.avatarPath, assetsConfig.logoPath, assetsConfig.heroNoisePath].join("\n")}
              footer="System uses these paths if the files exist, otherwise falls back to placeholders"
            />
          </div>
        </MotionWrapper>
      </div>
    </AppShell>
  );
}

function SettingsCard({
  title,
  body,
  footer,
}: {
  title: string;
  body: string;
  footer: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4 dark:bg-black/20 sm:rounded-[1.75rem] sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">{title}</p>
      <pre className="mt-2.5 whitespace-pre-wrap font-sans text-xs leading-5 text-white/72 sm:text-sm sm:leading-7">{body}</pre>
      <p className="mt-2.5 text-[10px] text-white/45 sm:text-xs">{footer}</p>
    </div>
  );
}
