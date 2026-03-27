import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useUserStore } from "@/entities/user/modal/store";
import { auth } from "@/shared/lib/firebase";
import { StopWatch } from "./stopwatch";
import { WorkoutLogDrawer } from "@/features/workoutlog/make-workoutlog-request/ui";

export const SessionPage = () => {
    const { workoutId, exerciseId } = useParams<{ workoutId: string; exerciseId: string }>();

    const { activeSession, createWorkoutLog } = useWorkoutLogStore();
    const {  user } = useUserStore();
    const userId = auth?.currentUser?.uid ?? "";

    const [isActive, setIsActive] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [startTimeStamp, setStartTimeStamp] = useState<string | null>(null);
    const [endTimeStamp, setEndTimeStamp] = useState<string | null>(null);

    useEffect(() => {
        // if (userId) {
        //     fetchUser(userId)
        // }
        
        setIsActive(!!activeSession);
    }, [userId, activeSession]);

    const handleStart = async () => {
        if (!workoutId) return toast.error("Workout not selected");
        if (!exerciseId) return toast.error("Exercise not selected");
        if (!userId) return toast.error("User not logged in");

        try {
            const start = new Date().toISOString();
            setStartTimeStamp(start);
            setIsActive(true);

            console.log("START DEBUG:", { workoutId, exerciseId, userId });

            await createWorkoutLog(workoutId, userId);
        } catch (error) {
            console.log(error);
            toast.error("Failed to start session");
        }
    }

    const handleStop = () => {
        if (!startTimeStamp) return toast.error("Session has not started yet");

        const endTime = new Date().toISOString();
        setEndTimeStamp(endTime);

        setIsActive(false);
        setOpenDrawer(true);
    }

    return (
        <div className="space-y-4">
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <StopWatch isActive={isActive} />

            {!isActive ? (
                <div className="flex justify-center">
                    <Button onClick={handleStart} className="rounded-xl px-6 py-3 text-lg font-medium">
                        Start
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Button onClick={handleStop} variant="destructive" className="rounded-xl px-6 py-3 text-lg font-medium text-stone-100">
                        Stop
                    </Button>
                </div>
            )}

            {openDrawer && <WorkoutLogDrawer open={openDrawer} setOpen={setOpenDrawer} startTimeStamp={startTimeStamp} endTimeStamp={endTimeStamp} />}

            <div className="py-2 flex justify-end">
                <Link to="/">
                    <Button variant="link">Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}