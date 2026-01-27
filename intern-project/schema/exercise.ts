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
            name: "userId",
            type: "string",
            title: "User ID",
            validation: rule => rule.required() 
        }
    ]
})