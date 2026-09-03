import { getGoogleReviewUrl } from "@/lib/urls";

export type TapLocation = {
  id: string;
  placeId: string;
};

export type TapRedirectResult =
  | { kind: "not_found" }
  | { kind: "redirect"; url: string };

export function isPrefetchRequest(headers: Headers): boolean {
  const purpose = `${headers.get("sec-purpose") ?? ""} ${headers.get("purpose") ?? ""}`.toLowerCase();
  if (purpose.includes("prefetch")) return true;
  return headers.get("x-middleware-prefetch") === "1";
}

export async function resolveTapRedirect(input: {
  location: TapLocation | null;
  recordTap: () => Promise<void>;
}): Promise<TapRedirectResult> {
  if (!input.location) return { kind: "not_found" };

  try {
    await input.recordTap();
  } catch (error) {
    console.error("Failed to record tap", error);
  }

  return {
    kind: "redirect",
    url: getGoogleReviewUrl(input.location.placeId),
  };
}
