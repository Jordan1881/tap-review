# TapReview

**הקישו לביקורת בגוגל** — NFC + QR redirect service for Israeli small businesses.

TapReview lets shop owners create a short URL and QR code that redirects customers directly to Google's official write-a-review page. The NFC card is dumb — this app is the dashboard and redirect layer.

## What it does

1. Owner signs up and adds a business location with a Google Place ID
2. App generates a unique short URL (`/r/{slug}`) and QR code
3. Owner writes the URL onto an NTAG213 NFC card (and prints the QR as fallback)
4. Customer taps or scans → server logs the tap → 302 redirect to Google review page

## What it does NOT do

- No review gating ("how was your visit?" filters)
- No star incentives or paid reviews
- No review hosting or scraping
- No native NFC encoder app
- No on-site kiosk / shared-tablet flow

## Quick start

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:43123](http://localhost:43123)

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path for local dev (`file:./dev.db`). Point at Postgres in production. |
| `NEXT_PUBLIC_APP_URL` | Public base URL for short links and QR codes (e.g. `http://localhost:43123`) |
| `SESSION_SECRET` | Secret for signing session cookies. Generate with `openssl rand -base64 32` |

## NFC encoding

1. Buy NTAG213 PVC cards (AliExpress or locally from Polymil, Petach Tikva)
2. Install **NFC Tools** on Android
3. **Write** → **Add a record** → **URL/URI**
4. Paste your TapReview short URL (from the dashboard)
5. Write to the tag, then **Lock tag**
6. Print the QR code as a backup
7. Test on both iPhone and Android before handing to customers

Chip: **NTAG213** (or NTAG215)

## Google policy

TapReview follows Google's review policies:

- Ask **all** customers for feedback — not just happy ones
- No incentives for star ratings
- No review gating or filtering
- Redirect goes to Google's official writereview URL only

## Tech stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma + SQLite (local) / Postgres-ready schema
- Email + password auth (bcrypt + JWT session cookies)
- Server-side QR generation (`qrcode` library)
- Hebrew-first RTL UI

## Project structure

```
app/
  page.tsx              # Marketing landing (Hebrew)
  login/ signup/        # Auth pages
  app/                  # Protected dashboard
  r/[slug]/route.ts     # Tap endpoint (302 redirect)
lib/
  auth.ts db.ts slug.ts # Core utilities
prisma/schema.prisma    # User, Location, Tap models
```

## Production notes

- Switch `DATABASE_URL` to a Postgres connection string
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Use a strong `SESSION_SECRET`
- Run `npx prisma migrate deploy` on deploy

## License

Private — built for Yarden Biton
