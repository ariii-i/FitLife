import { useParams } from "react-router-dom";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { useCallback, useEffect, useState } from "react";
import { useWorkoutLogStore } from "../store/workoutLogStore";
import { SessionForm } from "../components/session/sessionForm";

export const Session = () => {
    const { sessionId, workoutId } = useParams();
    const [session, setSession]=useState(null)
    const { fetchDetail } = useWorkoutExerciseStore()
    const {fetchWorkoutLog, workoutLog}=useWorkoutLogStore()
    console.log(workoutLog)

    const init=useCallback( async () => {
        const data=await fetchWorkoutLog(sessionId);
        setSession(data)
    }, [sessionId])

    useEffect(() => {
        init()
    }, [init])


    return (
        <div>
            <h1>Session</h1>
            <p>Workout ID: {workoutId}</p>
            <p>Session ID: {sessionId}</p>
            <pre>{JSON.stringify(workoutLog, null, 2)}</pre>
            <SessionForm/>
        </div>

    )
}