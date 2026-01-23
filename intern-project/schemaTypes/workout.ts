import { defineField, defineType } from "sanity";

export const workout = defineType({
    name: "workout",
    title: "Workout",
    type: "document",

    fields: [
        defineField({
            name: "title",
            title: "Workout Name",
            type: "string",
        }),
        
        defineField({
            name: "day",
            title: "Day",
            type: "string"
        }),

        defineField({
            name: "exercises",
            title: "Exercises",
            type: "array",
            of: [{
                type: "reference",
                to: [{ type: "exercise" }]
            }],
        })],
})