"use client";

export function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
      }}
      className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}
