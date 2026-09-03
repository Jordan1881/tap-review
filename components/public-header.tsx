import Link from "next/link";
import { isSignupEnabled } from "@/lib/env";

export function PublicHeader() {
  const signupEnabled = isSignupEnabled();

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
          {signupEnabled ? (
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              הרשמה
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
