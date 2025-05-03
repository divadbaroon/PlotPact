// Stress testing with concurrent users

import { chromium } from 'playwright';

import { expect } from '@playwright/test';

const NUM_USERS = 20;
const STORY_URL = 'https://plot-pact.vercel.app/story/1'; 

async function runUser(userIndex: number) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log(`User ${userIndex} started`);
    
    // 1. Go to the deployed PlotPact story page
    await page.goto(STORY_URL);

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
    await page.waitForSelector('text=Story Consistency Tips', {
      timeout: 15000,
    }); // Appears once constraints are loaded

    // 5. Ensure the textarea is now visible
    const textarea = page.locator(
      'textarea[placeholder="Write your story..."]'
    );
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

    console.log(`User ${userIndex} finished`);
  } catch (err) {
    console.error(`User ${userIndex} error:`, err);
  } finally {
    await browser.close();
  }
}

(async () => {
  const users = Array.from({ length: NUM_USERS }, (_, i) => runUser(i + 1));
  await Promise.all(users);
  console.log('All users finished.');
})();
