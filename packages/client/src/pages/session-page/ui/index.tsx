import { Button } from "@/components/ui/button";
import { SessionForm } from "@/features/session/make-session-request/ui/form";
import { useState } from "react";
import { When } from "react-if";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { StopWatch } from "./stopwatch";

export const SessionPage = () => {
    const { workoutId, exerciseId } = useParams<{
        workoutId: string;
        exerciseId: string;
    }>();

    const [isActive, setIsActive] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [startTimeStamp, setStartTimeStamp] = useState<string>("");
    const [endTimeStamp, setEndTimeStamp] = useState<string>("");


    const handleStart = () => {
        if (!workoutId) return toast.error("Workout not selected");

        const start = new Date().toISOString();
        setStartTimeStamp(start);
        setIsActive(true);
    };

    const handleStop = () => {
        if (!startTimeStamp) return toast.error("Session has not started yet");

        const endTime = new Date().toISOString();
        setEndTimeStamp(endTime);
        setIsActive(false);
        setOpenDrawer(true);
    };

    return (
        <div className="space-y-4">
            <StopWatch isActive={isActive} />

            {!isActive ? (
                <div className="flex justify-center">
                    <Button
                        onClick={handleStart}
                        className="rounded-xl px-6 py-3 text-lg font-medium"
                    >
                        Start
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Button
                        onClick={handleStop}
                        variant="destructive"
                        className="rounded-xl px-6 py-3 text-lg font-medium text-stone-100"
                    >
                        Stop
                    </Button>
                </div>
            )}

            <When condition={openDrawer}>
                <SessionForm openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} startTimeStamp={startTimeStamp} endTimeStamp={endTimeStamp} />
            </When>

        </div>
    );
};
