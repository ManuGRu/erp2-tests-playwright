const { Client } = require('pg');

async function testDbQuery(tableName) {
  const client = new Client({
    user: 'postgres', // Replace with your username
    host: 'test2.erp-levtech.ro', // Your server address
    database: 'ecf_auction_document', // The database to query
    password: 'MovonUcec5', // Replace with your password
    port: 5432, // Default PostgreSQL port
  });

  try {
    await client.connect();

    // Get column names from the table
    const columnsRes = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
    `, [tableName]);
    
    const columnNames = columnsRes.rows.map(row => row.column_name);

    // Get all data from the table
    const dataRes = await client.query(`SELECT * FROM ${tableName}`);
    const dataRows = dataRes.rows;

    await client.end();

    // Return an object containing column names and data
    return {
      columnNames: columnNames,
      data: dataRows
    };
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

module.exports = { testDbQuery };
