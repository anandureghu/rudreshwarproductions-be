import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('t_users', (table) => {
    table.boolean('agent').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('t_users', (table) => {
    table.dropColumn('agent');
  });
}
