type CardPreviewProps = {
  businessName: string;
  shortUrl: string;
  qrDataUrl: string;
};

export function CardPreview({
  businessName,
  shortUrl,
  qrDataUrl,
}: CardPreviewProps) {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-2 border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-lg">
      <div className="border-b border-slate-200 bg-primary px-6 py-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
          TapReview
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">{businessName}</h3>
      </div>
      <div className="flex flex-col items-center px-6 py-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8 text-primary"
            aria-hidden
          >
            <path
              d="M12 2C8.5 2 6 4.5 6 8v1H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-1V8c0-3.5-2.5-6-6-6z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="14" r="2" fill="currentColor" />
          </svg>
        </div>
        <p className="mb-1 text-center text-xl font-bold text-slate-900">
          הקישו לביקורת בגוגל
        </p>
        <p className="mb-6 text-center text-sm text-slate-500">
          NFC · סרקו QR
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt="QR"
          width={160}
          height={160}
          className="rounded-lg border border-slate-200"
        />
        <p dir="ltr" className="mt-4 break-all text-center text-xs text-slate-400">
          {shortUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>
      <div className="border-t border-slate-200 bg-slate-100 px-4 py-2 text-center text-xs text-slate-500">
        NTAG213 · TapReview
      </div>
    </div>
  );
}
