import { test, expect } from '@playwright/test';
const { testDbQuery } = require('./dbHelper');

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
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

  // Database query to verify data from "TechnicalProposal" table
  const tableName = 'TechnicalProposal'; // Replace with your table name
  const tableData = await testDbQuery(tableName);

  console.log('Column Names:', tableData.columnNames);
  console.log('Table Data:', tableData.data);

  // Example: You can add logic here to check if data from the database matches data on the page
  for (const row of tableData.data) {
    for (const [key, value] of Object.entries(row)) {
      if (value !== null && value !== undefined) {
        const isVisible = await page.isVisible(`text=${value}`);
        if (!isVisible) {
          console.error(`Value not found on page: ${value}`);
        } else {
          console.log(`Value found on page: ${value}`);
        }
      }
    }
  }

  // Close the context after the test
  await context.close();
});