import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { AuthForm, FormField } from "@/components/forms";
import { loginAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { isSignupEnabled } from "@/lib/env";
import { isSafeAppPath } from "@/lib/paths";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await requireUser();
  if (user) redirect("/app");

  const { next } = await searchParams;
  const safeNext = isSafeAppPath(next) ? next : "";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">התחברות</h1>
        <p className="mb-8 text-slate-600">היכנסו ללוח הבקרה שלכם</p>
        <AuthForm action={loginAction} submitLabel="התחברות">
          {safeNext ? <input type="hidden" name="next" value={safeNext} /> : null}
          <FormField
            label="אימייל"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="username"
          />
          <FormField
            label="סיסמה"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </AuthForm>
        {isSignupEnabled() ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            אין לכם חשבון?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              הרשמה
            </Link>
          </p>
        ) : null}
      </main>
    </div>
  );
}
