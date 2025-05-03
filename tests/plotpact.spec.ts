// Unit test for a workflow

import { test, expect } from '@playwright/test';

test('Full template plot flow: loading, constraint generation, story submission', async ({
  page,
}) => {
  // 1. Go to the deployed PlotPact story page (replace with your actual URL)
  await page.goto('https://plot-pact.vercel.app/story/1');

  // 2. Wait for the plot title to appear
  await expect(
    page.getByRole('heading', { name: /The Box with the Brass Dial/i })
  ).toBeVisible();

  // 3. Wait for the loading spinner and loading text to appear
  await expect(
    page.locator('text=Setting up your story and generating constraints')
  ).toBeVisible();
  await expect(page.locator('svg.animate-spin')).toBeVisible();

  // 4. Wait for constraints to finish loading (based on UI change)
  await page.waitForSelector('text=Story Consistency Tips', { timeout: 15000 }); // Appears once constraints are loaded

  // 5. Ensure the textarea is now visible
  const textarea = page.locator('textarea[placeholder="Write your story..."]');
  await expect(textarea).toBeVisible();

  // 6. Type a story paragraph
  const storyText =
    'Lila gripped the dial, took a deep breath, and turned it clockwise until she heard a click.';
  await textarea.fill(storyText);

  // 7. Click the Submit button
  await page.getByRole('button', { name: 'Submit' }).click();

  // 8. Wait a bit for the streaming animation to begin
  await page.waitForSelector('span.animate-pulse', { timeout: 5000 });

  // 9. Eventually, ensure the full paragraph is added
  await page.waitForTimeout(3000); // Wait for streaming to finish
  const paragraphs = await page.locator('.prose p').allTextContents();
  expect(
    paragraphs.some((p) => p.includes('Lila gripped the dial'))
  ).toBeTruthy();
});
