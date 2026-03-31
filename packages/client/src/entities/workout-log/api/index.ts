import { sanityClient } from "@/shared/lib/sanity";
import { WorkoutLog, WorkoutLogSession } from "../modal/type";
import { getUserApi } from "@/entities/user/api";

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutLogApi = async (
    workoutId: string,
    firebaseUid: string,
    date?: string
): Promise<WorkoutLog> => {
    const user = await getUserApi();
    const today = date || new Date().toISOString().split("T")[0];

    let log: WorkoutLog | null = await sanityClient.fetch(
        `*[_type=="workoutLog" && date == $today && workout._ref == $workoutId && user._id == $userId][0]`,
        { today, workoutId, userId: sanityUserId }
    );

    if (!log) {
        log = await sanityClient.create<WorkoutLog>({
            _type: "workoutLog",
            date: today,
            user: { _type: "reference", _ref: sanityUserId },
            workout: { _type: "reference", _ref: workoutId },
            sessions: [],
        });
    }

    return log;
};

export const addSessionApi = async (
    workoutLogId: string,
    sessionData: Omit<WorkoutLogSession, "_key">
): Promise<WorkoutLogSession> => {
    const newSession: WorkoutLogSession = {
        _key: get_unique_key(),
        ...sessionData,
        exercise: { _type: "reference", _ref: sessionData.exercise._id || sessionData.exercise._ref }
    };


    await sanityClient
        .patch(workoutLogId)
        .append("sessions", [newSession])
        .commit();

    return newSession;
};

export const getWorkoutLogApi = async (userId: string): Promise<WorkoutLog[]> => {
    return sanityClient.fetch<WorkoutLog[]>(`
    *[_type=="workoutLog" && user._ref == $userId] {
        _id,
        date,
        user -> { _id },
        workout -> { _id, name },
        sessions[] {
            _key,
            startTime,
            endTime,
            sets,
            reps,
            weight,
            completed,
            exercise -> { _id, name }
        }
    }`, { userId });
};

export const getLast7daysApi = async (userId: string, startDate: string) => {
    return sanityClient.fetch<{ date: string }[]>(`
        *[_type=="workoutLog" && user._ref == $userId && date >= $startDate && count(sessions[completed==true]) > 0]{
            date
            }`,
        { userId, startDate });
};