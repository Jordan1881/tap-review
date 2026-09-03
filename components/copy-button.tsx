"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("copied");
        } catch {
          setStatus("failed");
        }
        window.setTimeout(() => setStatus("idle"), 2000);
      }}
      className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {status === "copied" ? "הועתק" : status === "failed" ? "ההעתקה נכשלה" : label}
    </button>
  );
}
