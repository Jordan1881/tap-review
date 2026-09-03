import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { AuthForm, FormField } from "@/components/forms";
import { signupAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { isSignupEnabled } from "@/lib/env";

export default async function SignupPage() {
  const user = await requireUser();
  if (user) redirect("/app");

  if (!isSignupEnabled()) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">ההרשמה סגורה</h1>
          <p className="mb-8 text-slate-600">
            כרגע לא ניתן ליצור חשבון חדש. אם כבר יש לכם חשבון, התחברו.
          </p>
          <Link
            href="/login"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            התחברות
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">הרשמה</h1>
        <p className="mb-8 text-slate-600">צרו חשבון והתחילו לקבל ביקורות</p>
        <AuthForm action={signupAction} submitLabel="יצירת חשבון">
          <FormField label="שם מלא" name="name" placeholder="ישראל ישראלי" />
          <FormField label="אימייל" name="email" type="email" placeholder="you@example.com" />
          <FormField
            label="סיסמה"
            name="password"
            type="password"
            helpText="לפחות 8 תווים"
          />
        </AuthForm>
        <p className="mt-6 text-center text-sm text-slate-600">
          כבר יש לכם חשבון?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            התחברות
          </Link>
        </p>
      </main>
    </div>
  );
}
