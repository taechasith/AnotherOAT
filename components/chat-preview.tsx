import { MotionWrapper } from "@/components/motion-wrapper";
import { personaConfig } from "@/src/config/persona";
import { chatSeed } from "@/src/mock/chat-seed";
import { cn } from "@/src/lib/utils";

export function ChatPreview() {
  return (
    <MotionWrapper
      className="rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-glow backdrop-blur-xl"
      delay={0.08}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">ตัวอย่างบทสนทนา</p>
          <h2 className="mt-2 font-serif text-2xl text-white">น้ำเสียงที่ใกล้ชิด สุขุม และเป็นมนุษย์</h2>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/45">
          โหมดจำลอง
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {chatSeed.map((message) => (
          <div
            className={cn(
              "max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-7",
              message.role === "assistant"
                ? "border border-white/10 bg-white/8 text-white/86"
                : "ml-auto border border-transparent bg-white text-slate-900",
            )}
            key={message.id}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">คำถามแนะนำ</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {personaConfig.starterPrompts.map((prompt) => (
            <span
              className="rounded-full border border-white/15 bg-black/10 px-3 py-2 text-sm text-white/75 dark:bg-black/20"
              key={prompt}
            >
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}
