import { defineField, defineType } from "sanity";

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),

    defineField({
      name: 'email',
      type: 'string',
    }),

    defineField({
      name: "firebaseUid",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "photo",
      type: "url"
    })
  ],
})