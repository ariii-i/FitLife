import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("workout_exercises", (table) => {
    table.increments("id").primary();
    table
      .integer("workout_id")
      .notNullable()
      .references("id")
      .inTable("workouts")
      .onDelete("CASCADE");
    table
      .integer("exercise_id")
      .notNullable()
      .references("id")
      .inTable("exercises")
      .onDelete("CASCADE");
    table.integer("sets").defaultTo(3);
    table.integer("reps").defaultTo(10);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("workout_exercises");
}
