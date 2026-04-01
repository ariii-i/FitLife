import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("workouts", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("workouts");
}
