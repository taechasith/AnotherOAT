import { AppShell } from "@/components/app-shell";
import { HeroCard } from "@/components/hero-card";
import { LandingAbout } from "@/components/landing-about";
import { LandingEvidenceStrip } from "@/components/landing-evidence-strip";
import { MotionWrapper } from "@/components/motion-wrapper";
import { getResolvedAssets } from "@/src/lib/assets";
import { getPreviewSession } from "@/src/lib/preview-session";

export default async function HomePage() {
  const session = getPreviewSession();
  const assets = getResolvedAssets();

  return (
    <AppShell assets={assets} eyebrow="Your reflection begins here">
      <div className="space-y-5 lg:space-y-6">
        <MotionWrapper delay={0}>
          <HeroCard avatar={assets.avatar} />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <LandingEvidenceStrip session={session} />
        </MotionWrapper>

        <LandingAbout />
      </div>
    </AppShell>
  );
}
