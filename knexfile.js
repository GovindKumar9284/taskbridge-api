/**
 * Knex migration config for the repository.
 * Run with: npx knex migrate:latest --knexfile knexfile.js
 */
export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.db'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
