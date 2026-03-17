import {defineType, defineField} from 'sanity'

export const exercise = defineType({
  name: "exercise",
  title: "Exercise",
  type: "document",
  
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule: any) => rule.required(),
    }),
  ],
})