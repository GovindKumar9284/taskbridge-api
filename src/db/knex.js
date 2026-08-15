import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const filename = isTest ? ':memory:' : (process.env.DB_FILE || './data/dev.db');

const config = {
  client: 'sqlite3',
  connection: {
    filename
  },
  useNullAsDefault: true,
  pool: { min: 1, max: 5 }
};

let db;
try {
  db = knex(config);
} catch (err) {
  // Provide a clear actionable message for developers running tests without sqlite3
  // This avoids the obscure "Cannot find module 'sqlite3'" error and guides the user.
  // Tests still require sqlite3 to run migrations and queries; install it with:
  //   npm install sqlite3 --save
  // or run tests in an environment that has sqlite3 available (WSL / Linux / CI).
  // We re-throw so the failure is visible with the helpful message above.
  // eslint-disable-next-line no-console
  console.error('Failed to initialize Knex with sqlite3. Ensure the sqlite3 driver is installed: npm install sqlite3 --save');
  throw err;
}

export default db;
