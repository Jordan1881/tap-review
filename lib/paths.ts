export function isSafeAppPath(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value.startsWith("/app")) return false;
  if (value.startsWith("//")) return false;
  if (value.includes("://")) return false;
  if (value.includes("\\")) return false;
  if (value.includes("\0")) return false;
  return true;
}
