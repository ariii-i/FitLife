import { defineField, defineType } from "sanity";

export const exerciseLog = defineType({
    name: "exeerciseLog",
    type: "document",
    title: "Exercise Log",
    fields: [
        defineField({
            name: "exercise",
            type: "reference",
            to: [{ type: "exercise" }],
            validation: rule => rule.required(),
        }),

        defineField({
            name: "workout",
            type: "reference",
            to: [{ type: "workout" }],
            validation: rule => rule.required(),
        }),

        defineField({
            name: "date",
            type: "date",
            title:"Date"
        }),

        defineField({
            name: "sets",
            title: "Sets Completed",
            type: "number",
        }),

        defineField({
            name: "reps",
            title: "Reps Completed",
            type: "number"
        }),

        defineField({
            name: "completed",
            title:"Completed",
            type: "boolean",
            initialValue: false
        })
    ]
})