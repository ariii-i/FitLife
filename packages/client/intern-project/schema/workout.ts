import { defineField, defineType } from "sanity";

export const workout = defineType({
    name: 'workout',
    title: 'Workout',
    type: 'document',

    fields: [
        defineField({
            name: 'name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'exercises',
            type: 'array',
            of: [
                {
                    name:"WorkoutExercise",
                    title: "Workout Exercise",
                    type: 'object',
                    fields: [
                        {
                            name: 'exercise',
                            type: 'reference',
                            to: [{ type: 'exercise' }],
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'plannedSets',
                            type: 'number'
                        },
                        {
                            name: 'plannedReps',
                            type: 'number'
                        },
                    ],
                },
            ],
        }),
    ],
})