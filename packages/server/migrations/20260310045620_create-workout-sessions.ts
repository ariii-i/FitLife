import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("workout_sessions", (table) => {
    table.increments("id").primary();
    table.string("user_id").notNullable().references("user_id").inTable("users").onDelete("CASCADE");
    table
      .integer("workout_id")
      .notNullable()
      .references("id")
      .inTable("workouts")
      .onDelete("CASCADE");
    table.integer("duration_minutes");
    table.timestamp("performed_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("workout_sessions");
}
