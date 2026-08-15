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

const db = knex(config);
export default db;
