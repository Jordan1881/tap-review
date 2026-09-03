import { expect, test } from "@playwright/test";

test("GET /health is 200 when Postgres is reachable", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ ok: true });
});

test("GET /r/missing-slug is 404 HTML, not a 500", async ({ request }) => {
  const response = await request.get("/r/missing-slug");
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain("הקישור לא נמצא");
});
