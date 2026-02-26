import { sanityClient } from "../../shared/lib/sanity"

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutLogApi = (data, workoutId, exerciseId, startTimeStamp) => {
    return sanityClient.create({
        _type: "workoutLog",
        // user: {
        //     _type: "reference",
        //     _ref: userId,
        // },
        workout: {
            _type: "reference",
            _ref: workoutId,
        },
        date: new Date().toISOString().split("T")[0],
        completed: true,
        sessions: [{
            _key: get_unique_key(),
            startTime: startTimeStamp,
            endTime: new Date().toISOString(),
            exercise: {
                _type: "reference",
                _ref: exerciseId,
            },
            sets: Number(data.sets),
            reps: Number(data.reps),
            weight: Number(data.weight),
        }],
    });
};

export const getWorkoutLogApi = () => {
    return sanityClient.fetch(`*[_type=="workoutLog"]{
        completed, 
        date,
        user -> { _id },
        workout -> { _id, name},
        sessions[]{
            _key, 
            endTime,
            startTime,
            sets,
            reps,
            weight,
            exercise -> { _id, name}
            }
        }`
    )
}

export const getLast7daysApi = () => {
    return sanityClient.fetch(`*[_type == "workoutLog"
        && user._ref == $userId
        && date >= $startDate
        && completed == true]{
            date
        }`,
        { userId, startDate }
    );
}