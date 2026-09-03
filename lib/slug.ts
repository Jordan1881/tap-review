import { randomInt } from "crypto";
import { prisma } from "@/lib/db";

const SLUG_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 7;
const MAX_ATTEMPTS = 20;

function randomSlug(): string {
  let slug = "";
  for (let i = 0; i < SLUG_LENGTH; i++) {
    slug += SLUG_CHARS[randomInt(SLUG_CHARS.length)];
  }
  return slug;
}

export async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const slug = randomSlug();
    const existing = await prisma.location.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) return slug;
  }
  throw new Error("Failed to generate unique slug");
}

export { getAppUrl, getShortUrl, getGoogleReviewUrl } from "@/lib/urls";
