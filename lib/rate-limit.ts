export class MemoryRateLimiter {
  private hits = new Map<string, number[]>();

  constructor(private readonly now: () => number = Date.now) {}

  allow(key: string, limit: number, windowMs: number): boolean {
    const now = this.now();
    const windowStart = now - windowMs;
    const recent = (this.hits.get(key) ?? []).filter((stamp) => stamp > windowStart);

    if (recent.length >= limit) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export const rateLimiter = new MemoryRateLimiter();

export function getClientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return headerList.get("x-real-ip")?.trim() || "unknown";
}
