import { defineField, defineType } from "sanity";

export const workout= defineType({
    name:"workout",
    title:"workout",
    type:"document",
    fields:[
        defineField({
            name:"name",
            title:"Workout Name",
            type:"string",
            validation:(Rule)=>Rule.required(),
        }),
        defineField({
            name:"date",
            title:"Date",
            type:"date"
        }),
        defineField({
            name:"duration",
            title:"Duraion (minutes)",
            type:"number",
        })
    ],
})