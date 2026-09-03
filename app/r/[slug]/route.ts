import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimiter } from "@/lib/rate-limit";
import { isPrefetchRequest, resolveTapRedirect } from "@/lib/tap";

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><title>לא נמצא</title></head>
<body style="font-family:system-ui;text-align:center;padding:4rem;">
<h1>הקישור לא נמצא</h1>
<p>ייתכן שהכרטיס לא הוגדר או שהקישור שגוי.</p>
</body>
</html>`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = getClientIp(request.headers);

  let location: { id: string; placeId: string } | null;
  try {
    location = await prisma.location.findUnique({
      where: { slug },
      select: { id: true, placeId: true },
    });
  } catch (error) {
    console.error("Tap lookup failed", error);
    return new NextResponse("Service unavailable", { status: 503 });
  }

  const skipLog =
    !rateLimiter.allow(`tap:${ip}`, 60, 60_000) ||
    isPrefetchRequest(request.headers);

  const result = await resolveTapRedirect({
    location,
    recordTap: async () => {
      if (!location || skipLog) return;
      const userAgent = request.headers.get("user-agent") ?? undefined;
      await prisma.$transaction([
        prisma.tap.create({
          data: {
            locationId: location.id,
            userAgent,
          },
        }),
        prisma.location.update({
          where: { id: location.id },
          data: { tapCount: { increment: 1 } },
        }),
      ]);
    },
  });

  if (result.kind === "not_found") {
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.redirect(result.url, 302);
}
