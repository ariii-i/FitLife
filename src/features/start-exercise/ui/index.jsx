import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/ui/button";
import { useWorkoutLogStore } from "../../../entities/workout-log/store";
import { StopWatch } from "./stopwatch";
import { useUserStore } from "../../../entities/user/store";
import { StopExercise } from "../../stop-exercise/ui";
import { useWorkoutStore } from "../../../entities/workout/store";

export const SessionPage = () => {
    const { workoutId, exerciseId } = useParams();
    const navigate = useNavigate();
    const { activeSession, startSession, stopSession } = useWorkoutLogStore()
    const { users, fetchUsers } = useUserStore();
    const {workout}=useWorkoutStore()
    const [isActive, setIsActive] = useState(false);
    const [open, setOpen]=useState(false);
    const [startTimeStamp, setStartTimeStamp] = useState("");

    const [timer, setTimer] = useState()
    useEffect(() => {
        fetchUsers()
        setIsActive(!!activeSession);
        console.log("workoutId", workoutId)
        console.log("exerciseId", exerciseId)
    }, [activeSession]);

    const handleStart = async () => {
        setIsActive(true);
        setStartTimeStamp(new Date().toISOString());
    };

    const handleStop = async () => {
        setIsActive(false);
        setOpen(true);
        const duration = new Date() - startTimeStamp
            // OPEN MODAL FROM FORM TO GET INFO FROM USER
            // INSERT INTO 
            
            // navigate(`/workout/${workoutId}/session/${exerciseId}`);

    };

    return (
        <div className="space-y-2">
            <StopWatch isActive={isActive} />
            {!isActive ? (
                <div className="flex justify-center">
                    <Button onClick={handleStart} type="button" className="rounded-xl px-6 py-3 text-lg font-medium">
                        Start
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2 justify-center">
                    <Button onClick={handleStop} type="button" variant="destructive" className="rounded-xl px-6 py-3 text-lg font-medium text-stone-100">
                        Stop
                    </Button>
                </div>
            )}

            {open && (<StopExercise open={open} setOpen={setOpen} startTimeStamp={startTimeStamp}/>)}

            <div className="py-2 flex justify-end">
                <Link to="/">
                    <Button type="button" variant="link">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
};