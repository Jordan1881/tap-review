"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold text-slate-900">משהו השתבש</h1>
      <p className="mb-6 max-w-md text-slate-600">
        לא הצלחנו לטעון את העמוד. נסו שוב בעוד רגע.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        נסו שוב
      </button>
    </div>
  );
}
