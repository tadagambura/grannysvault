import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('intro')).toBeVisible();
  for (let i = 0; i < 3; i++) await page.getByTestId('intro-next').click();
  await expect(page.getByTestId('lock')).toBeVisible();
  await expect(page.getByText(/Web test preview/)).toBeVisible();
  await page.getByTestId('unlock').click();
  await expect(page.getByTestId('vault')).toBeVisible();
}

test('locked on open; add a login with a hidden password; it shows on reveal only', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  await page.getByTestId('add-login').click();
  await page.getByTestId('entry-title').fill("Dad's bank");
  await page.getByTestId('field-site').fill('Barclays');
  await page.getByTestId('field-username').fill('dad@example.com');
  await page.getByTestId('field-password').fill('Hunter2!');
  await expect(page.getByTestId('field-password')).toHaveAttribute('type', 'password');
  await page.getByTestId('entry-save').click();
  await expect(page.getByTestId("entry-Dad's bank")).toBeVisible();
  await page.getByTestId("entry-Dad's bank").click();
  await expect(page.getByTestId('field-password')).toHaveValue('Hunter2!');
  await expect(page.getByTestId('field-password')).toHaveAttribute('type', 'password');
  await page.getByTestId('reveal-password').click();
  await expect(page.getByTestId('field-password')).not.toHaveAttribute('type', 'password');
  // The password never goes into normal storage
  const stored = await page.evaluate(() => Object.values(localStorage).join(' '));
  expect(stored).toContain("Dad's bank");
  expect(stored).not.toContain('Hunter2!');
  expect(errors).toEqual([]);
});

test('emergency map shows contacts and medical; completeness goes up', async ({ page }) => {
  await open(page);
  await page.getByTestId('add-contact').click();
  await page.getByTestId('entry-title').fill('Auntie Pat');
  await page.getByTestId('field-phone').fill('07700 900123');
  await page.getByTestId('entry-save').click();
  await page.getByTestId('add-medical').click();
  await page.getByTestId('entry-title').fill("Mum's health");
  await page.getByTestId('field-gp').fill('Park Surgery 01234 567890');
  await page.getByTestId('entry-save').click();
  await expect(page.getByText('Ready for an emergency: 2 of 5')).toBeVisible();
  await page.getByRole('tab', { name: /Emergency/ }).click();
  await expect(page.getByTestId('map-Auntie Pat')).toContainText('07700 900123');
  await expect(page.getByTestId("map-Mum's health")).toContainText('Park Surgery');
});

test('validation and the reload re-lock', async ({ page }) => {
  await open(page);
  await page.getByTestId('add-contact').click();
  await page.getByTestId('entry-title').fill('X');
  await page.getByTestId('field-phone').fill('call me maybe');
  await page.getByTestId('entry-save').click();
  await expect(page.getByText('That phone number looks unusual.')).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('lock')).toBeVisible();
});
