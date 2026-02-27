import { sanityClient } from "../../shared/lib/sanity"

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutLogApi = async (workoutId, startTimeStamp) => {
    const today = new Date().toISOString();

    let log = sanityClient.fetch(
        `*[_type=="workoutLog" && date >= $today][0]`,
        { today }
    );

    if (!log) {
        log = await sanityClient.create({
            _type: "workoutLog",
            user: {
                _type: "reference",
                _ref: userId
            },
            workout: {
                _type: "reference",
                _ref: workoutId
            },
            date: today,
            startTime: startTimeStamp,
            sessions: [],
        });
    }

    return log;
};

export const addSessionApi = async (data, logId, exerciseId, startTime) => {
    const newSession = {
        _type: "session",
        _key: crypto.randomUUID(),
        exercise: {
            _type: "reference",
            _ref: exerciseId
        },
        startTime,
        endTime: new Date(),
        sets: Number(data.sets),
        reps: Number(data.reps),
        weight: Number(data.weight),
        completed: true,
    };

    return await sanityClient
        .patch(logId)
        .append("sessions", [newSession])
        .commit();
};

export const getWorkoutLogApi = () => {
    return sanityClient.fetch(`*[_type=="workoutLog"]{ 
        _id,
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
            completed,
            exercise -> { _id, name}
            }
        }`
    )
}

export const getLast7daysApi = (userId, startDate) => {
    return sanityClient.fetch(`*[_type == "workoutLog"
        && user._ref == $userId
        && date >= $startDate
        && completed == true]{
            date
        }`,
        { userId, startDate }
    );
}