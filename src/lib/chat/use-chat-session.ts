"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createId } from "@/src/lib/utils";
import type { ChatMessage, SessionState } from "@/src/lib/types";

const STORAGE_KEY = "another-oat-chat-state";
const STREAM_TIMEOUT_MS = 25000;

type PersistedState = {
  messages: ChatMessage[];
  session: SessionState;
};

export function useChatSession({
  initialMessages,
  initialSession,
}: {
  initialMessages: ChatMessage[];
  initialSession: SessionState;
}) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserMessageRef = useRef<string | null>(null);

  const [session, setSession] = useState(initialSession);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "typing" | "error" | "timeout" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Partial<PersistedState>;
      if (parsed.messages) setMessages(parsed.messages);
      if (parsed.session) setSession(parsed.session as SessionState);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages,
        session,
      } satisfies PersistedState),
    );
  }, [messages, session]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const banner = useMemo(() => {
    if (status === "loading") {
      return { kind: "loading" as const, label: "กำลังเชื่อมต่อเซสชัน..." };
    }
    if (status === "typing") {
      return { kind: "loading" as const, label: "another oat กำลังเรียบเรียงคำตอบแบบสตรีม..." };
    }
    if (status === "success") {
      return {
        kind: "success" as const,
        label: "พร้อมสนทนาแล้ว ข้อความล่าสุดถูกบันทึกในเครื่องนี้",
      };
    }
    if (status === "timeout") {
      return {
        kind: "error" as const,
        label: "ระบบตอบช้ากว่าที่ควร จึงตัดการรอไว้ก่อน คุณสามารถลองส่งซ้ำได้",
        onRetry: lastUserMessageRef.current ? () => void sendMessage(lastUserMessageRef.current!) : undefined,
      };
    }
    if (status === "error") {
      return {
        kind: "error" as const,
        label: errorMessage ?? "เกิดข้อผิดพลาดบางอย่างในการส่งข้อความ",
        onRetry: lastUserMessageRef.current ? () => void sendMessage(lastUserMessageRef.current!) : undefined,
      };
    }
    if (providerNotice) {
      return {
        kind: "error" as const,
        label: providerNotice,
      };
    }
    return { kind: "idle" as const };
  }, [errorMessage, providerNotice, status]);

  async function refreshSession() {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/session-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRefresh: true }),
      });

      const payload = (await response.json()) as { session: SessionState };
      setSession(payload.session);
      setProviderNotice(null);
      setStatus("success");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      setErrorMessage("รีเฟรชข้อมูลสาธารณะไม่สำเร็จ");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function sendMessage(prefilled?: string) {
    const content = (prefilled ?? input).trim();
    if (!content || status === "typing") return;

    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    lastUserMessageRef.current = content;
    setMessages((current) => [...current, userMessage]);
    setStreamingMessage({
      id: createId("assistant"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    });
    setInput("");
    setErrorMessage(null);
    setProviderNotice(null);
    setStatus("typing");

    timeoutRef.current = setTimeout(() => {
      setStatus("timeout");
      setStreamingMessage(null);
    }, STREAM_TIMEOUT_MS);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: content,
          history: [...messages, userMessage],
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.trim()) continue;
          const event = JSON.parse(part) as
            | { type: "chunk"; text: string }
            | { type: "done"; mode: string; reason?: string | null }
            | { type: "error"; message: string };

          if (event.type === "chunk") {
            accumulated += event.text;
            setStreamingMessage((current) =>
              current
                ? {
                    ...current,
                    content: accumulated,
                  }
                : null,
            );
          }

          if (event.type === "done" && event.mode === "mock-fallback") {
            setProviderNotice(
              event.reason === "AI provider quota is unavailable"
                ? "คีย์เชื่อมต่อได้ แต่โปรเจกต์ของ AI provider ยังไม่มี quota เพียงพอ จึงใช้คำตอบสำรองชั่วคราว"
                : "ระบบสลับไปใช้คำตอบสำรอง เพราะบริการ AI ภายนอกยังไม่พร้อม",
            );
          }

          if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: accumulated.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setStreamingMessage(null);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (error) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStreamingMessage(null);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสตรีมข้อความ");
    }
  }

  return {
    banner,
    input,
    isRefreshing,
    messages,
    session,
    setInput,
    sendMessage,
    refreshSession,
    streamingMessage,
  };
}
