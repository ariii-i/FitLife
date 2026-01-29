import { defineType } from "sanity";

export const exercise = defineType({
    name: "exercise",
    title: "Exercise",
    type: "document",
    fields: [
        {
            name: "name",
            type: "string",
            title: "Exercise Name",
        },
    ]
})