import { defineField, defineType } from "sanity";

export const workoutLog = defineType({
  name: "workoutLog",
  title: "Workout Log",
  type: "document",
  fields: [
    defineField({
      name: "sessionId",
      type: "string",
      validation: rule => rule.required()
    }),

    defineField({
      name: "workout_exercises",
      type: "reference",
      to: [{ type: "exercise" }],
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
      type: "datetime",
    }),

    defineField({
      name: "end_time",
      type: "datetime",
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
