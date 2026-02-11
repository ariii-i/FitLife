import { defineField, defineType } from "sanity";

export const workoutLog = defineType({
  name: "workoutLog",
  title: "Workout Log",
  type: "document",
  fields: [
    defineField({
      name: "workoutExercises",
      type: "reference",
      to: [{ type: "workout_exercise" }],
      validation: rule => rule.required()
    }),

    defineField({
      name: "sessionId",
      type: "string",
      validation: rule => rule.required()
    }),

    defineField({
      name: "sets",
      type: "number",
    }),

    defineField({
      name: "reps",
      type: "number",
    }),

    defineField({
      name: "weight",
      type: "number"
    }),

    defineField({
      name: "start_time",
      type: "string",
    }),

    defineField({
      name: "end_time",
      type: "string",
    }),

    defineField({
      name: "date",
      type: "date",
    }),

    defineField({
      name: "duration",
      type: "number",
    }),

  ],
})
