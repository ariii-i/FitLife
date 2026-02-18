import { defineField, defineType } from "sanity";

export const workoutLog = defineType({
    name: 'workoutLog',
    title: 'Workout Log',
    type: 'document',

    fields: [
        defineField({
            name: 'user',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'workout',
            type: 'reference',
            to: [{ type: 'workout' }],
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'date',
            type: 'date',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'completed',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'sessions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'session',
                    fields: [
                        defineField({
                            name: 'startTime',
                            type: 'datetime',
                        }),

                        defineField({
                            name: 'endTime',
                            type: 'datetime',
                        }),

                        defineField({
                            name: 'exercise',
                            type: 'reference',
                            to: [{ type: 'exercise' }],
                            validation: (rule) => rule.required(),
                        }),

                        defineField({
                            name: 'sets',
                            type: 'number',
                        }),

                        defineField({
                            name: 'reps',
                            type: 'number',
                        }),

                        defineField({
                            name: 'weight',
                            type: 'number',
                        })
                    ],
                },
            ],
        }),
    ],
})