import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StopWatch } from "./stopwatch";
import { toast } from "sonner";
import { auth } from "../../../shared/lib/firebase";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useUserStore } from "@/entities/user/modal/store";
import { Button } from "@/components/ui/button";
import { StopExercise } from "@/features/stop-exercise/ui";

export const SessionPage = () => {
    const { workoutId, exerciseId } = useParams();
    const navigate = useNavigate();
    const { activeSession, createWorkoutLog } = useWorkoutLogStore()
    const { user, fetchUser } = useUserStore();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [startTimeStamp, setStartTimeStamp] = useState<string | null>(null)

    const userId :string= auth?.currentUser?.uid ?? "";;
    useEffect(() => {
        if (userId) {
            fetchUser(userId)
        }
        setIsActive(!!activeSession);
    }, [userId, activeSession]);


    const handleStart = async () => {
        try {
            setIsActive(true);
            setStartTimeStamp(new Date().toISOString());
            await createWorkoutLog(workoutId, exerciseId, userId)

        } catch (error) {
            console.error("error", error)
        }
    };

    const handleStop = async () => {
        if (!startTimeStamp) {
            toast.error("Session has not started yet.");
            return;
        }

        setIsActive(false);
        setOpen(true);

        const startTime = new Date(startTimeStamp).getTime();
        const endTime = Date.now();
        const duration = endTime - startTime;

        // const totalSeconds = Math.floor(duration / 1000);
        // const hours = Math.floor(totalSeconds / 3600);
        // const minutes = Math.floor((totalSeconds % 3600) / 60);
        // const seconds = totalSeconds % 60;
        // console.log("Session duration:", { hours, minutes, seconds });

    }

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

            {open && (<StopExercise open={open} setOpen={setOpen} startTimeStamp={startTimeStamp} />)}

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