import { AppShell } from "@/components/app-shell";
import { MotionWrapper } from "@/components/motion-wrapper";
import { assetsConfig } from "@/src/config/assets";
import { personaConfig } from "@/src/config/persona";
import { sourcesConfig } from "@/src/config/sources";
import { getPersonaProfile, getPersonaProfilePath } from "@/src/lib/chat/persona-profile";

export default async function SettingsPage() {
  const personaProfile = await getPersonaProfile();

  return (
    <AppShell eyebrow="หน้าดูค่าตั้งต้นรวมศูนย์">
      <main className="mt-10 lg:mt-14">
        <MotionWrapper className="rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">ตั้งค่า</p>
          <h1 className="mt-2 font-serif text-4xl text-white">แก้ค่าหลักของแอปได้จากไฟล์ config โดยตรง</h1>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <SettingsCard
              title="Persona Markdown"
              body={personaProfile || "(empty persona file)"}
              footer={getPersonaProfilePath()}
            />
            <SettingsCard
              title="แหล่งข้อมูล"
              body={sourcesConfig.searchTerms.join(", ")}
              footer={`ผู้ให้ข้อมูลที่เปิดอยู่: ${sourcesConfig.providerList.filter((item) => item.enabled).length}`}
            />
            <SettingsCard
              title="Framework"
              body={personaConfig.frameworkInstruction}
              footer={`Starter prompts: ${personaConfig.defaultStarterPrompts.length}`}
            />
            <SettingsCard
              title="ไฟล์ภาพ"
              body={[assetsConfig.avatarPath, assetsConfig.logoPath, assetsConfig.heroNoisePath].join("\n")}
              footer="ถ้ามีไฟล์จริงอยู่ตาม path นี้ ระบบจะใช้แทน placeholder อัตโนมัติ"
            />
          </div>
        </MotionWrapper>
      </main>
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
    <div className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5 dark:bg-black/20">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{title}</p>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-white/72">{body}</pre>
      <p className="mt-4 text-xs text-white/45">{footer}</p>
    </div>
  );
}
