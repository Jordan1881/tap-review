import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppDashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const locations = await prisma.location.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      tapCount: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">המיקומים שלי</h1>
          <p className="mt-1 text-slate-600">נהלו את כרטיסי ה-NFC וה-QR שלכם</p>
        </div>
        <Link
          href="/app/locations/new"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + מיקום חדש
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="mb-2 text-lg font-medium text-slate-900">
            עדיין אין מיקומים
          </p>
          <p className="mb-6 text-slate-600">
            הוסיפו את העסק הראשון שלכם כדי לקבל קישור קצר וקוד QR
          </p>
          <Link
            href="/app/locations/new"
            className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            הוספת מיקום ראשון
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {locations.map((location) => (
            <li key={location.id}>
              <Link
                href={`/app/locations/${location.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm"
              >
                <div>
                  <h2 className="font-bold text-slate-900">{location.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">/r/{location.slug}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary">
                    {location.tapCount}
                  </p>
                  <p className="text-xs text-slate-500">הקשות</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-bold text-slate-900">הנחיות קידוד NFC</h2>
        <ol className="list-decimal space-y-2 pr-5 text-sm leading-relaxed text-slate-600">
          <li>הורידו את האפליקציה NFC Tools (Android).</li>
          <li>בחרו Write → Add a record → URL/URI.</li>
          <li>הדביקו את הקישור הקצר מהמיקום שלכם.</li>
          <li>כתבו על שבב NTAG213 ונעלו את התג (Lock tag).</li>
          <li>הדפיסו גם את קוד ה-QR כגיבוי.</li>
          <li>בדקו ב-iPhone וב-Android לפני חלוקה ללקוחות.</li>
        </ol>
      </section>
    </div>
  );
}
