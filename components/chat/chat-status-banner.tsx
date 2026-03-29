import { AlertTriangle, CheckCircle2, LoaderCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export type ChatBannerState =
  | { kind: "idle" }
  | { kind: "loading"; label: string }
  | { kind: "success"; label: string }
  | { kind: "error"; label: string; onRetry?: () => void };

export function ChatStatusBanner({ state }: { state: ChatBannerState }) {
  if (state.kind === "idle") return null;

  if (state.kind === "loading") {
    return (
      <Panel className="flex items-center gap-3 p-4 text-sm text-white/72">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        <span>{state.label}</span>
      </Panel>
    );
  }

  if (state.kind === "success") {
    return (
      <Panel className="flex items-center gap-3 p-4 text-sm text-emerald-100">
        <CheckCircle2 className="h-4 w-4" />
        <span>{state.label}</span>
      </Panel>
    );
  }

  return (
    <Panel className="flex flex-col gap-3 p-4 text-sm text-amber-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4" />
        <span>{state.label}</span>
      </div>
      {state.onRetry ? (
        <Button onClick={state.onRetry} type="button" variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      ) : null}
    </Panel>
  );
}
