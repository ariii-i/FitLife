import { defineField, defineType } from "sanity";

export const workout_exercise=defineType({
    name:"workout_exercise",
    type:"document",
    title:"Workout Exercise",
    fields:[ 
        defineField({
            name:"userId",
            type:"string",
            title:"User Id",
            validation: rule => rule.required()
        }),

        defineField({
            name:"exercise",
            type:"reference",
            to:[{type:"exercise"}]
        }),

        defineField({
            name:"workout",
            type:"reference",
            to:[{type:"workout"}]
        }),

        defineField({
            name:"set",
            type:"number",
            title:"Sets"
        }),

        defineField({
            name:"reps",
            type:"number"
        })
    ]
})