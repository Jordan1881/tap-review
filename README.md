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
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string (`postgresql://...`). Use `sslmode=require` in production. |
| `NEXT_PUBLIC_APP_URL` | Public base URL for short links and QR codes. Required in production. |
| `SESSION_SECRET` | Secret for signing session cookies. At least 32 characters. Generate with `openssl rand -base64 32` |
| `SIGNUP_ENABLED` | Set to `false` to close public signup |

## NFC encoding

Do not lock tags until `NEXT_PUBLIC_APP_URL` is the real public origin. A wrong URL on a locked tag is permanent.

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
- Prisma + Postgres
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
  health/route.ts       # Liveness + database check
lib/
  auth.ts db.ts slug.ts # Core utilities
prisma/schema.prisma    # User, Location, Tap models
```

## Production notes

- Set `NEXT_PUBLIC_APP_URL` to the public HTTPS origin before encoding NFC cards
- Use a `SESSION_SECRET` of at least 32 characters
- Point `DATABASE_URL` at Postgres (`sslmode=require` on Railway)
- Run `npx prisma migrate deploy` on deploy (already part of `npm start`)
- Optional: `SIGNUP_ENABLED=false` after the first owner account exists

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs **lint**, **test**, and **build** on every pull request and every push to `main`. The workflow sets dummy `SESSION_SECRET`, `DATABASE_URL`, and `NEXT_PUBLIC_APP_URL` values so production env assertions pass; they are not real secrets.

Railway deploys from `main` via the GitHub integration after CI passes. Actions does not run `railway up`, so the pipeline will not double-deploy.

Protect `main` by requiring the `ci` status check (shown as **CI / ci**) before merge.

## License

Private — built for Yarden Biton
