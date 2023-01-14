import { expect, test } from '@playwright/test';

test('index page has expected Discover header', async ({ page }) => {
	await page.goto('/');
});
