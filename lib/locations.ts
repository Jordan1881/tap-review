export type LocationRecord = {
  id: string;
  userId: string;
};

export type LocationDetails = {
  name: string;
  placeId: string;
};

export type LocationRepo = {
  findOwned(
    userId: string,
    locationId: string
  ): Promise<LocationRecord | null>;
  updateDetails(locationId: string, data: LocationDetails): Promise<void>;
  deleteOwned(userId: string, locationId: string): Promise<number>;
  setSlug(locationId: string, slug: string): Promise<void>;
};

export async function updateOwnedLocation(
  repo: LocationRepo,
  userId: string,
  locationId: string,
  data: LocationDetails
) {
  const location = await repo.findOwned(userId, locationId);
  if (!location) return { ok: false as const, error: "המיקום לא נמצא" };
  await repo.updateDetails(locationId, data);
  return { ok: true as const };
}

export async function deleteOwnedLocation(
  repo: LocationRepo,
  userId: string,
  locationId: string
) {
  const deleted = await repo.deleteOwned(userId, locationId);
  if (deleted === 0) return { ok: false as const, error: "המיקום לא נמצא" };
  return { ok: true as const };
}

export async function regenerateOwnedSlug(
  repo: LocationRepo,
  userId: string,
  locationId: string,
  nextSlug: string
) {
  const location = await repo.findOwned(userId, locationId);
  if (!location) return { ok: false as const, error: "המיקום לא נמצא" };
  await repo.setSlug(locationId, nextSlug);
  return { ok: true as const };
}
