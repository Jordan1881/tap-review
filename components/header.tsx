import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export async function AppHeader() {
  const user = await requireUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/app" className="text-xl font-bold text-primary">
          TapReview
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              שלום, {user.name}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                יציאה
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          TapReview
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            התחברות
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            הרשמה
          </Link>
        </nav>
      </div>
    </header>
  );
}
