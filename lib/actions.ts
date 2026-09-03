"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import {
  changePasswordSchema,
  loginSchema,
  locationSchema,
  parseFormData,
  signupSchema,
} from "@/lib/validation";
import { generateUniqueSlug } from "@/lib/slug";
import { isSignupEnabled } from "@/lib/env";
import { isSafeAppPath } from "@/lib/paths";
import { getClientIp, rateLimiter } from "@/lib/rate-limit";
import {
  deleteOwnedLocation,
  regenerateOwnedSlug,
  updateOwnedLocation,
  type LocationRepo,
} from "@/lib/locations";

export type ActionState = {
  error?: string;
  success?: string;
};

const prismaLocationRepo: LocationRepo = {
  findOwned: (userId, locationId) =>
    prisma.location.findFirst({
      where: { id: locationId, userId },
      select: { id: true, userId: true },
    }),
  updateDetails: async (locationId, data) => {
    await prisma.location.update({ where: { id: locationId }, data });
  },
  deleteOwned: async (userId, locationId) => {
    const result = await prisma.location.deleteMany({
      where: { id: locationId, userId },
    });
    return result.count;
  },
  setSlug: async (locationId, slug) => {
    await prisma.location.update({ where: { id: locationId }, data: { slug } });
  },
};

async function clientIp() {
  return getClientIp(await headers());
}

function tooManyAttempts(): ActionState {
  return { error: "נסיונות רבים מדי. נסו שוב בעוד דקה." };
}

export async function signupAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSignupEnabled()) {
    return { error: "ההרשמה סגורה כרגע" };
  }

  const ip = await clientIp();
  if (!rateLimiter.allow(`signup:${ip}`, 5, 15 * 60_000)) {
    return tooManyAttempts();
  }

  const parsed = parseFormData(signupSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (existing) {
    return { error: "כתובת האימייל כבר רשומה במערכת" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await createSession(user.id, user.email);
  redirect("/app");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const ip = await clientIp();
  if (!rateLimiter.allow(`login:${ip}`, 10, 15 * 60_000)) {
    return tooManyAttempts();
  }

  const parsed = parseFormData(loginSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user) {
    return { error: "אימייל או סיסמה שגויים" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "אימייל או סיסמה שגויים" };
  }

  await createSession(user.id, user.email);
  const next = formData.get("next");
  redirect(isSafeAppPath(next) ? next : "/app");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = parseFormData(changePasswordSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!account) redirect("/login");

  const valid = await verifyPassword(
    parsed.data.currentPassword,
    account.passwordHash
  );
  if (!valid) {
    return { error: "הסיסמה הנוכחית שגויה" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: account.id },
    data: { passwordHash },
  });
  await createSession(account.id, account.email);
  return { success: "הסיסמה עודכנה" };
}

export async function createLocationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = parseFormData(locationSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const { name, placeId } = parsed.data;
  const slug = await generateUniqueSlug();

  const location = await prisma.location.create({
    data: {
      userId: user.id,
      name: name.trim(),
      placeId: placeId.trim(),
      slug,
    },
  });

  redirect(`/app/locations/${location.id}`);
}

export async function updateLocationAction(
  locationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = parseFormData(locationSchema, formData);
  if (!parsed.success) return { error: parsed.error };

  const result = await updateOwnedLocation(
    prismaLocationRepo,
    user.id,
    locationId,
    {
      name: parsed.data.name.trim(),
      placeId: parsed.data.placeId.trim(),
    }
  );
  if (!result.ok) return { error: result.error };

  revalidatePath(`/app/locations/${locationId}`);
  return { success: "הפרטים עודכנו" };
}

export async function deleteLocationAction(locationId: string) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const result = await deleteOwnedLocation(
    prismaLocationRepo,
    user.id,
    locationId
  );
  if (!result.ok) {
    return;
  }

  revalidatePath("/app");
  redirect("/app");
}

export async function regenerateSlugAction(locationId: string) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const nextSlug = await generateUniqueSlug();
  const result = await regenerateOwnedSlug(
    prismaLocationRepo,
    user.id,
    locationId,
    nextSlug
  );
  if (!result.ok) {
    return;
  }

  revalidatePath(`/app/locations/${locationId}`);
  revalidatePath("/app");
  redirect(`/app/locations/${locationId}`);
}
