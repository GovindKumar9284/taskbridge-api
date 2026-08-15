// UNREVIEWED AI-GENERATED Project model (as produced by Copilot)
import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './data/projects.db'
  },
  useNullAsDefault: true
});

// Simple setup - create table if not exists
await db.schema.hasTable('projects').then(async (exists) => {
  if (!exists) {
    await db.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('teamId');
      table.string('status');
      table.string('ownerId');
      table.timestamps(true, true);
    });
  }
});

export default db;
