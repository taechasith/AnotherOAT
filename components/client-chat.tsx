"use client";

import { Download, RefreshCcw, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { personaConfig } from "@/src/config/persona";
import { siteConfig } from "@/src/config/site";
import { createId, formatDateLabel } from "@/src/lib/utils";
import type { ChatMessage, SessionState } from "@/src/lib/types";

type ClientChatProps = {
  initialMessages: ChatMessage[];
  initialSession: SessionState;
};

export function ClientChat({ initialMessages, initialSession }: ClientChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [session, setSession] = useState(initialSession);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    localStorage.setItem("another-oat-session", JSON.stringify(session));
  }, [session]);

  function exportReflection() {
    const body = messages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = siteConfig.exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function submitMessage(nextPrompt?: string) {
    const content = (nextPrompt ?? input).trim();
    if (!content) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: createId("user"), role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: content,
        history: nextMessages,
      }),
    });

    const payload = (await response.json()) as { message: ChatMessage };
    setMessages((current) => [...current, payload.message]);
  }

  function refreshSession() {
    startTransition(async () => {
      const response = await fetch("/api/session-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forceRefresh: true }),
      });

      const payload = (await response.json()) as { session: SessionState };
      setSession(payload.session);
      router.refresh();
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-glow backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/50">บทสนทนา</p>
            <h1 className="mt-2 font-serif text-3xl text-white">คุยกับ another oat</h1>
          </div>
          <div className="text-sm text-white/45">{formatDateLabel(session.fetchedAt)}</div>
        </div>

        <div className="mt-6 space-y-4">
          {messages.map((message) => (
            <div
              className={
                message.role === "assistant"
                  ? "max-w-[90%] rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-3 text-sm leading-7 text-white/86"
                  : "ml-auto max-w-[85%] rounded-[1.5rem] bg-white px-4 py-3 text-sm leading-7 text-slate-900"
              }
              key={message.id}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/12 bg-black/10 p-3 dark:bg-black/20">
          <textarea
            className="min-h-24 w-full resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-white/35"
            onChange={(event) => setInput(event.target.value)}
            placeholder="ถามถึงคำวิจารณ์ที่ยังค้างอยู่ สิ่งที่เปลี่ยนไป หรือขอบเขตที่ควรถูกตั้งไว้ตอนนี้"
            value={input}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {personaConfig.starterPrompts.slice(0, 2).map((prompt) => (
                <button
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10"
                  key={prompt}
                  onClick={() => void submitMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <Button onClick={() => void submitMessage()} type="button">
              <SendHorizonal className="mr-2 h-4 w-4" />
              ส่งข้อความ
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-glow backdrop-blur-xl sm:p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">สภาพจิตใจ</p>
          <h2 className="mt-2 font-serif text-2xl text-white">
            ความรู้สึกตอนนี้: {getEmotionLabel(session.mindState.emotionalWeight)}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/68">{session.mindState.summary}</p>

          <div className="mt-5 space-y-4 text-sm text-white/74">
            <SignalGroup label="คำวิจารณ์ที่ยุติธรรม" items={session.mindState.fairCriticism} />
            <SignalGroup label="การโจมตีที่ไม่ยุติธรรม" items={session.mindState.unfairAttacks} />
            <SignalGroup label="ข่าวลือ / ข้อมูลไม่ชัด" items={session.mindState.rumors} />
            <SignalGroup label="การเติบโต" items={session.mindState.growthSignals} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-glow backdrop-blur-xl sm:p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">เครื่องมือของเซสชัน</p>
          <div className="mt-4 flex flex-col gap-3">
            <Button onClick={refreshSession} type="button" variant="ghost">
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isPending ? "กำลังรีเฟรช..." : "รีเฟรชสัญญาณจากสาธารณะ"}
            </Button>
            <Button onClick={exportReflection} type="button" variant="ghost">
              <Download className="mr-2 h-4 w-4" />
              ส่งออกสรุปเป็นข้อความ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              className="rounded-full border border-white/15 bg-black/10 px-3 py-1 dark:bg-black/20"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-white/45">ยังไม่มีสัญญาณเด่นชัด</span>
        )}
      </div>
    </div>
  );
}

function getEmotionLabel(weight: SessionState["mindState"]["emotionalWeight"]) {
  if (weight === "heavy") return "หนัก";
  if (weight === "moderate") return "ปานกลาง";
  return "เบาลง";
}
