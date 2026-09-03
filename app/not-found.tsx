import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold text-slate-900">העמוד לא נמצא</h1>
      <p className="mb-6 max-w-md text-slate-600">
        ייתכן שהקישור שגוי או שהעמוד הוסר.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
