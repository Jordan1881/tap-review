import { describe, expect, test } from "vitest";
import {
  deleteOwnedLocation,
  regenerateOwnedSlug,
  updateOwnedLocation,
  type LocationRecord,
  type LocationRepo,
} from "@/lib/locations";

function memoryRepo(seed: LocationRecord[]): LocationRepo & {
  rows: Array<LocationRecord & { name?: string; placeId?: string; slug?: string }>;
} {
  const rows: Array<LocationRecord & { name?: string; placeId?: string; slug?: string }> =
    seed.map((row) => ({ ...row }));
  return {
    rows,
    findOwned: async (userId, locationId) =>
      rows.find((row) => row.id === locationId && row.userId === userId) ?? null,
    updateDetails: async (locationId, data) => {
      const row = rows.find((item) => item.id === locationId);
      if (row) Object.assign(row, data);
    },
    deleteOwned: async (userId, locationId) => {
      const index = rows.findIndex(
        (row) => row.id === locationId && row.userId === userId
      );
      if (index < 0) return 0;
      rows.splice(index, 1);
      return 1;
    },
    setSlug: async (locationId, slug) => {
      const row = rows.find((item) => item.id === locationId);
      if (row) row.slug = slug;
    },
  };
}

describe("updateOwnedLocation", () => {
  test("updates details when the location belongs to the user", async () => {
    const repo = memoryRepo([{ id: "loc_1", userId: "user_a" }]);

    const result = await updateOwnedLocation(repo, "user_a", "loc_1", {
      name: "קפה הרצל",
      placeId: "ChIJTestPlace",
    });

    expect(result).toEqual({ ok: true });
    expect(repo.rows[0]).toMatchObject({
      name: "קפה הרצל",
      placeId: "ChIJTestPlace",
    });
  });

  test("does not update another user's location", async () => {
    const repo = memoryRepo([{ id: "loc_1", userId: "user_a" }]);

    const result = await updateOwnedLocation(repo, "user_b", "loc_1", {
      name: "hacked",
      placeId: "ChIJHacked",
    });

    expect(result).toEqual({ ok: false, error: "המיקום לא נמצא" });
    expect(repo.rows[0].name).toBeUndefined();
  });
});

describe("deleteOwnedLocation", () => {
  test("deletes only a location the user owns", async () => {
    const repo = memoryRepo([
      { id: "loc_1", userId: "user_a" },
      { id: "loc_2", userId: "user_b" },
    ]);

    const mine = await deleteOwnedLocation(repo, "user_a", "loc_1");
    const theirs = await deleteOwnedLocation(repo, "user_a", "loc_2");

    expect(mine).toEqual({ ok: true });
    expect(theirs).toEqual({ ok: false, error: "המיקום לא נמצא" });
    expect(repo.rows.map((row) => row.id)).toEqual(["loc_2"]);
  });
});

describe("regenerateOwnedSlug", () => {
  test("refuses to rotate a slug the user does not own", async () => {
    const repo = memoryRepo([{ id: "loc_1", userId: "user_a" }]);

    const result = await regenerateOwnedSlug(
      repo,
      "user_b",
      "loc_1",
      "newslug"
    );

    expect(result.ok).toBe(false);
    expect(repo.rows[0].slug).toBeUndefined();
  });
});
