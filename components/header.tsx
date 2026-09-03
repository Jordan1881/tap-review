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
