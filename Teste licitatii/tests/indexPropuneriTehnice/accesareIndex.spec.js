import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.use({
  viewport: { width: 1920, height: 1080 },
  //headless: false, // Set to false to run in visible mode
  //slowMo: 500, // This will slow down each action by 50ms, you can adjust this as needed
});

test('Accesare', async ({ browser }) => {
  // Create a new context with a fresh state
  const context = await browser.newContext();
  const page = await context.newPage();

  // Perform your test actions
  await page.goto('https://test2.erp-levtech.ro/');
  await page.locator('#kt_header_user_menu_toggle').getByText('Hello').click();
  await page.getByRole('link', { name: 'Language Română' }).click();
  await page.getByRole('link', { name: 'Română', exact: true }).click();
  await page.getByText('APLICAȚII').click();
  await page.getByText('Licitații').click();
  await page.getByRole('link', { name: '   Propuneri tehnice' }).click();

  // Wait for the page to load
  await page.waitForURL('https://test2.erp-levtech.ro/auction-document/proposal');
  expect(page.url()).toBe('https://test2.erp-levtech.ro/auction-document/proposal');

  // Close the context after the test
  await context.close();
});