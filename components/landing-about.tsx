import Link from "next/link";
import { ArrowRight, BrainCircuit, FlaskConical, Layers3, Mic2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScrollReveal, StaggerItem, StaggerList } from "@/components/motion-wrapper";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "เริ่มเซสชัน",
    description:
      'กด "เริ่มเซสชัน" ระบบจะดึงข้อมูลสดจากอินเทอร์เน็ต วิเคราะห์โทนเนื้อหา และเตรียมบริบทครบถ้วนก่อนเปิดบทสนทนา — ใช้เวลาไม่กี่วินาที',
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
];

const SCIENCE_ITEMS = [
  {
    icon: FlaskConical,
    title: "Negativity Scoring",
    description:
      "แต่ละรายการจากอินเทอร์เน็ตถูกให้คะแนน 0.0–1.0 เพื่อวัดระดับเนื้อหาเชิงลบ ก่อนนำไปจำแนกในขั้นถัดไป",
  },
  {
    icon: Layers3,
    title: "4-Category Signal Classification",
    description:
      "คำวิจารณ์ที่ยุติธรรม · การโจมตีที่ไม่เป็นธรรม · ข่าวลือ · สัญญาณการเติบโต — ทั้งสี่หมวดถูกคัดแยกโดยระบบก่อนทุกเซสชัน",
  },
  {
    icon: BrainCircuit,
    title: "Mind State Derivation",
    description:
      'ระบบรวมสัญญาณทั้งหมดเพื่อสรุป "สภาวะใจ" ปัจจุบัน ซึ่งกำหนดทิศทางและน้ำเสียงของการตอบสนอง',
  },
  {
    icon: Mic2,
    title: "Persona-Driven Voice",
    description:
      "การตอบทุกครั้งอ้างอิงโปรไฟล์ตัวตนจริงของโอ๊ตเป็นหลัก เพื่อให้น้ำเสียงสะท้อนประสบการณ์และมุมมองที่แท้จริง",
  },
];

export function LandingAbout() {
  return (
    <div className="space-y-5 lg:space-y-6">
      {/* ── About ─────────────────────────────────────────────── */}
      <ScrollReveal>
        <Panel className="overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">
                About This Project
              </p>
              <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
                Another OAT: คุยกับอดีตของ<br className="hidden sm:block" /> โอ๊ต ปราโมทย์
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#cbc3d7]">
                พื้นที่ที่ให้คุณสนทนากับภาพสะท้อนของ{" "}
                <span className="font-medium text-white/90">โอ๊ต ปราโมทย์</span>{" "}
                นักแสดงและศิลปินชาวไทย ผ่านข้อมูลจริงที่โลกออนไลน์บันทึกไว้
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cbc3d7]">
                ระบบไม่ได้แค่แสดงข้อความจากอินเทอร์เน็ต แต่จำแนก วิเคราะห์
                และเตรียมบริบทที่ซื่อสัตย์ก่อนทุกบทสนทนา
                เพื่อให้คุณแยกแยะได้ว่าอะไรคือเสียงที่ควรฟัง
                และอะไรที่ควรปล่อยผ่าน
              </p>
            </div>

            <div className="shrink-0">
              <Button asChild size="lg">
                <Link href="/chat">
                  เริ่มสนทนาเลย
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* decorative rule */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatPill label="Signal categories" value="4" />
            <StatPill label="Data sources" value="Live" />
            <StatPill label="Persona profile" value="Real" />
          </div>
        </Panel>
      </ScrollReveal>

      {/* ── How It Works ──────────────────────────────────────── */}
      <ScrollReveal delay={0.08}>
        <Panel className="p-6 sm:p-8">
          <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">
            How It Works
          </p>
          <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
            วิธีใช้งานในสามขั้นตอน
          </h2>

          <StaggerList className="mt-6 grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <StaggerItem key={item.step}>
                <div className="flex h-full flex-col rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
                  <span className="font-display text-3xl text-[rgba(208,188,255,0.2)]">{item.step}</span>
                  <p className="mt-3 text-sm font-semibold text-[#e8dff5]">{item.title}</p>
                  <p className="mt-2 text-xs leading-6 text-[#958ea0]">
                    {item.description}
                  </p>
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
            The Science
          </p>
          <h2 className="font-display font-semibold mt-2 text-[#e8dff5] text-xl sm:text-2xl">
            ตรรกะเบื้องหลังระบบ
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cbc3d7]">
            กระบวนการทำงานทุกขั้นตอนออกแบบให้โปร่งใสและสามารถตรวจสอบได้
          </p>

          <StaggerList className="mt-6 grid gap-4 sm:grid-cols-2">
            {SCIENCE_ITEMS.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex gap-4 rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e8dff5]">{item.title}</p>
                    <p className="mt-1.5 text-xs leading-6 text-[#cbc3d7] sm:text-sm sm:leading-7">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
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
