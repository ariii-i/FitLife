import { defineType } from "sanity";

export const exercise= defineType({
    name: "exercise",
    title: "Exercise",
    type: "document",
    fields:[
        {
            name: "name",
            type: "string",
            title: "Exercise Name",
        },

        {
            name: "muscleGroup",
            type: "string",
            title: "Muscle Group"
        },
        
        {
            name:"equipment",
            type:"string",
            title:"Equipment",
        }]
})