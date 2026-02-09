import { useParams } from "react-router-dom";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { useCallback, useEffect, useState } from "react";
import { useWorkoutLogStore } from "../store/workoutLogStore";
import { SessionForm } from "../components/session/sessionForm";
import { SessionList } from "../components/session/displaySession";

export const Session = () => {
    const { sessionId, workoutId } = useParams();
    const [session, setSession] = useState(null)
    const { fetchDetail } = useWorkoutExerciseStore()
    const { fetchWorkoutLog, workoutLog } = useWorkoutLogStore()
    console.log(workoutLog)

    const init = useCallback(async () => {
        const data = await fetchWorkoutLog(sessionId);
        setSession(data)
    }, [sessionId])

    useEffect(() => {
        init()
    }, [init])


    return (
        <div>
            <pre>{JSON.stringify(workoutLog, null, 2)}</pre>
            {workoutLog.length}
            <SessionForm sessionId={sessionId} workoutExerciseId={workoutId}
            />
            <SessionList sessionId={sessionId}/>
        </div>

    )
}