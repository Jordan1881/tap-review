import Link from "next/link";
import { PublicHeader } from "@/components/public-header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
              NFC + QR לביקורות גוגל
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              הקישו לביקורת בגוגל
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              TapReview נותן לעסק שלך כרטיס NFC וקוד QR. הלקוח נוגע בכרטיס —
              ומגיע ישירות לדף כתיבת הביקורת הרשמי של גוגל. בלי אפליקציה, בלי
              סינון, בלי הבטחות מזויפות.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="w-full rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white hover:bg-primary-dark sm:w-auto"
              >
                התחילו בחינם
              </Link>
              <Link
                href="/login"
                className="w-full rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                כבר יש לי חשבון
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
            <FeatureCard
              step="1"
              title="הרשמה והגדרה"
              description="מוסיפים את שם העסק ומזהה Google Place ID — מקבלים קישור קצר וקוד QR."
            />
            <FeatureCard
              step="2"
              title="כתיבה על הכרטיס"
              description="כותבים את הקישור על כרטיס NTAG213 עם NFC Tools, ומדפיסים את ה-QR כגיבוי."
            />
            <FeatureCard
              step="3"
              title="הלקוח מקיש"
              description="נגיעה בכרטיס או סריקת QR — מעבר ישיר לדף הביקורת של גוגל. סופרים הקשות בלוח הבקרה."
            />
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              שקיפות ותקינות
            </h2>
            <p className="text-slate-600 leading-relaxed">
              TapReview לא מסנן ביקורות, לא מבטיח 5 כוכבים, ולא מציע תמריצים
              לדירוג. כל לקוח מגיע לאותו דף ביקורת רשמי של גוגל — בדיוק כמו
              שצריך.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        TapReview — כלי לעסקים קטנים בישראל
      </footer>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {step}
      </div>
      <h3 className="mb-2 font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
