import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://test2.erp-levtech.ro/');
  await page.getByRole('link', { name: 'Logo' }).click();
  await page.getByRole('link', { name: 'English' }).click();
  await page.getByText('APLICAȚII').click();
  await page.getByText('Licitații').click();
  await page.getByText('Administrare').nth(1).click();
  await page.getByRole('link', { name: '   Propuneri tehnice' }).click();
});