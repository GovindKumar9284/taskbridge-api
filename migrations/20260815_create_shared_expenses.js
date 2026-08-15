export async function up(knex) {
  const exists = await knex.schema.hasTable('shared_expenses');
  if (!exists) {
    await knex.schema.createTable('shared_expenses', (table) => {
      table.increments('id').primary();
      table.integer('project_id').notNullable().index();
      table.string('payer_id').notNullable();
      table.decimal('amount', 14, 2).notNullable();
      table.string('currency', 3).notNullable().defaultTo('USD');
      table.text('participants').notNullable(); // JSON string
      table.string('event_type').notNullable().defaultTo('EXPENSE_CREATED');
      table.string('org_id').notNullable().index();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('shared_expenses');
}
