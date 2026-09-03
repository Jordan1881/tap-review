import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getGoogleReviewUrl } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const location = await prisma.location.findUnique({
    where: { slug },
    select: { id: true, placeId: true },
  });

  if (!location) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><title>לא נמצא</title></head>
<body style="font-family:system-ui;text-align:center;padding:4rem;">
<h1>הקישור לא נמצא</h1>
<p>ייתכן שהכרטיס לא הוגדר או שהקישור שגוי.</p>
</body>
</html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

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

  const reviewUrl = getGoogleReviewUrl(location.placeId);
  return NextResponse.redirect(reviewUrl, 302);
}
