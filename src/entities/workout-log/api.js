import { sanityClient } from "../../shared/lib/sanity"

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutLogApi = async (workoutId, exerciseId, userId) => {
    const today = new Date().toISOString().split("T")[0];
    console.log(today)

    let log = await sanityClient.fetch(
        `*[_type=="workoutLog" && date == $today][0]`,
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
            sessions: [{
                _type: "session",
                _key: get_unique_key(),
                exercise: {
                    _type: "reference",
                    _ref: exerciseId
                },
            }],
        });
    }
    return log;
};

export const addSessionApi = async (data, workoutId, exerciseId, startTimeStamp) => {
    const newSession = {
        _type: "session",
        _key: get_unique_key(),
        exercise: {
            _type: "reference",
            _ref: exerciseId
        },
        startTime: startTimeStamp,
        endTime: new Date(),
        sets: Number(data.sets),
        reps: Number(data.reps),
        weight: Number(data.weight),
        completed: true,
    };

    console.log(newSession)

    if (!workoutId) {
        console.error("Workout ID missing");
        return;
    }

    return await sanityClient
    .patch(workoutId)
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
    return sanityClient.fetch(
        `*[_type == "workoutLog"
          && user._ref == $userId
          && date >= $startDate
          && count(sessions[completed == true]) > 0
        ]{
            date
        }`,
        { userId, startDate }
    );
};