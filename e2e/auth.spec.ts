import { expect, test } from "@playwright/test";

function uniqueEmail() {
  return `e2e.${Date.now()}.${Math.random().toString(16).slice(2)}@example.com`;
}

test("unauthenticated /app is sent to login", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login/);
});

test("signup, wrong password, then login reach the dashboard", async ({
  page,
}) => {
  const email = uniqueEmail();
  const password = "password1";

  await page.goto("/signup");
  await page.getByLabel("שם מלא").fill("בדיקת בריאות");
  await page.getByLabel("אימייל").fill(email);
  await page.getByLabel("סיסמה").fill(password);
  await page.getByRole("button", { name: "יצירת חשבון" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "המיקומים שלי" })).toBeVisible();

  await page.getByRole("button", { name: "יציאה" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/login");
  await page.getByLabel("אימייל").fill(email);
  await page.getByLabel("סיסמה").fill("wrong-password");
  await page.getByRole("button", { name: "התחברות" }).click();
  await expect(page.getByRole("alert")).toHaveText("אימייל או סיסמה שגויים");

  await page.getByLabel("סיסמה").fill(password);
  await page.getByRole("button", { name: "התחברות" }).click();
  await expect(page).toHaveURL(/\/app$/);
});
