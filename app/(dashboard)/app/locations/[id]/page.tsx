import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { updateLocationAction } from "@/lib/actions";
import { getShortUrl, getGoogleReviewUrl } from "@/lib/slug";
import { generateQrDataUrl } from "@/lib/qr";
import { LocationForm } from "@/components/location-form";
import { CardPreview } from "@/components/card-preview";
import { CopyButton } from "@/components/copy-button";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const location = await prisma.location.findFirst({
    where: { id, userId: user.id },
    include: {
      taps: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, createdAt: true, userAgent: true },
      },
    },
  });

  if (!location) notFound();

  const shortUrl = getShortUrl(location.slug);
  const googleUrl = getGoogleReviewUrl(location.placeId);
  const qrDataUrl = await generateQrDataUrl(shortUrl);

  const boundUpdateAction = updateLocationAction.bind(null, location.id);

  return (
    <div>
      <Link
        href="/app"
        className="mb-6 inline-block text-sm text-primary hover:underline"
      >
        ← חזרה למיקומים
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{location.name}</h1>
          <p className="mt-1 text-slate-600">
            {location.tapCount} הקשות · נוצר ב-
            {location.createdAt.toLocaleDateString("he-IL")}
          </p>
        </div>
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">קישור קצר</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <code
            dir="ltr"
            className="flex-1 break-all rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-800"
          >
            {shortUrl}
          </code>
          <CopyButton text={shortUrl} label="העתקה" />
        </div>
        <p className="mt-3 text-sm text-slate-500">
          כתבו קישור זה על כרטיס ה-NTAG213 שלכם
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">קוד QR</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt={`QR code for ${location.name}`}
            width={280}
            height={280}
            className="rounded-xl border border-slate-200"
          />
          <div className="text-sm text-slate-600">
            <p className="mb-2">הדפיסו את הקוד ושימו ליד הקופה או על השולחן.</p>
            <p>הקוד מפנה לאותו קישור קצר כמו ה-NFC.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">תצוגת כרטיס להדפסה</h2>
        <CardPreview
          businessName={location.name}
          shortUrl={shortUrl}
          qrDataUrl={qrDataUrl}
        />
        <p className="mt-3 text-center text-sm text-slate-500">
          צלמו מסך או הדפיסו — טקסט מוצע: &quot;הקישו לביקורת בגוגל&quot;
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">יעד ההפניה</h2>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="break-all text-sm text-primary hover:underline"
        >
          {googleUrl}
        </a>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">הקשות אחרונות</h2>
        {location.taps.length === 0 ? (
          <p className="text-slate-500">עדיין אין הקשות — נסו לפתוח את הקישור בדפדפן</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {location.taps.map((tap) => (
              <li key={tap.id} className="flex justify-between py-3 text-sm">
                <span className="text-slate-700">
                  {tap.createdAt.toLocaleString("he-IL")}
                </span>
                <span className="max-w-[50%] truncate text-slate-400" dir="ltr">
                  {tap.userAgent?.slice(0, 60) ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">עריכת פרטים</h2>
        <LocationForm
          action={boundUpdateAction}
          submitLabel="שמירת שינויים"
          defaultName={location.name}
          defaultPlaceId={location.placeId}
        />
      </section>
    </div>
  );
}
