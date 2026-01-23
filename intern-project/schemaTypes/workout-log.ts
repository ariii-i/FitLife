import { defineField, defineType } from "sanity";

export const workoutLog=defineType({
    name:"workoutLog",
    title:"Workout Log",
    type:"document",
    fields:[
        defineField({
            name:"workout",
            type:"array",
            of: [{
                type: "reference",
                to: [{ type: "workout"}]
            }],
        }),

        defineField({
            name:"date",
            type:"datetime",
        }),

        defineField({
            name:"completed",
            type:"boolean"
        })
    ]
})