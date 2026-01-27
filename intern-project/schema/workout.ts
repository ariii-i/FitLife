import { defineField, defineType } from "sanity";

export const workout = defineType({
    name: "workout",
    title: "Workout",
    type: "document",

    fields: [
        defineField({
            name: "userId",
            type: "string",
            title: "User ID",
            validation: rule => rule.required()
        }),

        defineField({
            name: "name",
            title: "Workout Name",
            type: "string",
        }),
    ]


})