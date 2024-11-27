import { test, expect } from '@playwright/test';
const { testDbQuery } = require('./dbHelper');

test('Fetch data from TechnicalProposal table', async () => {
  try {
    const tableName = 'TechnicalProposal'; // Replace with your table name if needed
    console.log(`Fetching data from the "${tableName}" table...`);

    // Call the function to get the table data
    const tableData = await testDbQuery(tableName);

    // Log the column names
    console.log('Column Names:', tableData.columnNames);

    // Log each row of data
    console.log('Table Data:');
    tableData.data.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    // Example assertion: Check that data was retrieved
    expect(tableData.data.length).toBeGreaterThan(0);

    // You can add more assertions to validate specific data
    // For example:
    // expect(tableData.data[0]).toHaveProperty('Id');
    // expect(tableData.data[0]).toHaveProperty('Name');

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error to fail the test
  }
});
