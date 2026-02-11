import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useWorkoutLogStore } from "../store/workoutLogStore";
import { SessionForm } from "../components/session/sessionForm";
import { SessionList } from "../components/session/displaySession";
import { WorkoutHistory } from "../components/session/workoutHistory";

export const Session = () => {
    const { sessionId, workoutId } = useParams();
    const { fetchWorkoutLog, workoutLog } = useWorkoutLogStore()

    const [session, setSession] = useState(null)

    const init = useCallback(async () => {
        const data = await fetchWorkoutLog(sessionId);
        console.log("fetchWorkoutLog", data)
        setSession(data)
    }, [sessionId])

    useEffect(() => {
        init()
    }, [init])


    return (
        <div>
            {workoutLog.length}
            <SessionForm sessionId={sessionId} workoutExerciseId={workoutId}
            />
            <WorkoutHistory sessionId={sessionId} workoutExerciseId={workoutId}/>
        </div>

    )
}