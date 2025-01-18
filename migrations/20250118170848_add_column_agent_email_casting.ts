import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE t_castings
    ADD COLUMN agent_email VARCHAR(255),
    ADD CONSTRAINT fk_castings_agent_email FOREIGN KEY (agent_email)
    REFERENCES t_users(email) ON DELETE SET NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE t_castings
    DROP CONSTRAINT fk_castings_agent_email,
    DROP COLUMN agent_email;
  `);
}
