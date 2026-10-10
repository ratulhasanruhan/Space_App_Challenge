import { test, expect } from '@playwright/test';

test('skyblink complete e2e flow', async ({ page }) => {
  // Wait for React to mount the UI. 
  // We use the Next.js dev server which is at port 3000
  await page.goto('http://localhost:3000/');

  // Landing page
  await expect(page.locator('text=SkyBlink')).toBeVisible();

  // Open Viewer
  await page.goto('http://localhost:3000/viewer/F_MOVER');
  
  // Viewer generic UI
  await expect(page.locator('text=Viewer: F_MOVER')).toBeVisible();

  // Viewer modes
  const blinkBtn = page.locator('button', { hasText: 'Blink' });
  const swipeBtn = page.locator('button', { hasText: 'Swipe' });
  const diffBtn = page.locator('button', { hasText: 'Difference' });

  await blinkBtn.click();
  expect(page.url()).toContain('mode=blink');
  
  await swipeBtn.click();
  expect(page.url()).toContain('mode=swipe');

  await diffBtn.click();
  expect(page.url()).toContain('mode=difference');

  // Detective mode
  const detectiveBtn = page.locator('button', { hasText: 'Detective' });
  await detectiveBtn.click();
  await expect(page.locator('text=Detective Mode')).toBeVisible();
  
  // Click candidate
  const candidateBtn = page.locator('button', { hasText: 'F_MOVER_1.25_0' });
  await candidateBtn.click();
  await expect(page.locator('text=Details: F_MOVER_1.25_0')).toBeVisible();

  // Check spectrum
  await expect(page.locator('text=Spectrum Analysis')).toBeVisible();
});
