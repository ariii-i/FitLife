import { defineField, defineType } from "sanity";

export const workout_exercise = defineType({
    name: "workout_exercise",
    type: "document",
    title: "Workout Exercise",
    fields: [
        defineField({
            name: "exercise",
            type: "reference",
            to: [{ type: "exercise" }]
        }),

        defineField({
            name: "workout",
            type: "reference",
            to: [{ type: "workout" }]
        }),

        defineField({
            name: "plannedSets",
            type: "number",
            title: "Planned Sets"
        }),

        defineField({
            name: "plannedReps",
            type: "number",
            title: "Planned Reps"
        })
    ]
})