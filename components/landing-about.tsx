"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, FlaskConical, Layers3, Mic2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScrollReveal, StaggerItem, StaggerList } from "@/components/motion-wrapper";
import { useT } from "@/src/lib/i18n";

export function LandingAbout() {
  const t = useT();
  const SCIENCE_ICONS = [FlaskConical, Layers3, BrainCircuit, Mic2];

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* ── About ─────────────────────────────────────────────── */}
      <ScrollReveal>
        <Panel className="overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">
                {t.about.label}
              </p>
              <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
                {t.about.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#cbc3d7]">
                {t.about.desc1}{" "}
                <span className="font-medium text-white/90">{t.about.desc1name}</span>
                {t.about.desc1end}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cbc3d7]">
                {t.about.desc2}
              </p>
            </div>

            <div className="shrink-0">
              <Button asChild size="lg">
                <Link href="/chat">
                  {t.about.startChat}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatPill label={t.about.signalCategories} value="4" />
            <StatPill label={t.about.dataSources} value="Live" />
            <StatPill label={t.about.personaProfile} value="Real" />
          </div>
        </Panel>
      </ScrollReveal>

      {/* ── How It Works ──────────────────────────────────────── */}
      <ScrollReveal delay={0.08}>
        <Panel className="p-6 sm:p-8">
          <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">
            {t.about.howItWorks}
          </p>
          <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
            {t.about.howTitle}
          </h2>

          <StaggerList className="mt-6 grid gap-4 sm:grid-cols-3">
            {t.about.steps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="flex h-full flex-col rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
                  <span className="font-display text-3xl text-[rgba(208,188,255,0.2)]">{item.step}</span>
                  <p className="mt-3 text-sm font-semibold text-[#e8dff5]">{item.title}</p>
                  <p className="mt-2 text-xs leading-6 text-[#958ea0]">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </Panel>
      </ScrollReveal>

      {/* ── The Science ───────────────────────────────────────── */}
      <ScrollReveal delay={0.12}>
        <Panel className="p-6 sm:p-8">
          <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">
            {t.about.theScience}
          </p>
          <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
            {t.about.scienceTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cbc3d7]">
            {t.about.scienceSubtitle}
          </p>

          <StaggerList className="mt-6 grid gap-4 sm:grid-cols-2">
            {t.about.science.map((item, i) => {
              const Icon = SCIENCE_ICONS[i % SCIENCE_ICONS.length];
              return (
                <StaggerItem key={item.title}>
                  <div className="flex gap-4 rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e8dff5]">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-6 text-[#cbc3d7] sm:text-sm sm:leading-7">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerList>
        </Panel>
      </ScrollReveal>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
      <span className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">{label}</span>
      <p className="text-xl font-bold text-[#d0bcff] mt-1">{value}</p>
    </div>
  );
}
