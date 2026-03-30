import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { SessionFieldSet } from "./field-set";
import { auth } from "@/shared/lib/firebase";
import { useState } from "react";
import { WorkoutCompletedWidget } from "@/widget/workout-completed/ui";

type SessionFormValue = {
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
};

export const SessionForm = ({ startTimeStamp, endTimeStamp }: {
    startTimeStamp: string | null,
    endTimeStamp: string | null
}) => {
    const { workoutId, exerciseId } = useParams<{ workoutId: string; exerciseId: string }>();
    const navigate = useNavigate();

    const [open, setOpen] = useState<boolean>(false);

    const { addSession, workoutLogs } = useWorkoutLogStore();
    const { register, handleSubmit } = useForm<SessionFormValue>();
    const userId = auth.currentUser?.uid ?? "";

    const log = workoutLogs.find((log) => log.workout._ref === workoutId);
    const workoutLogId = log?._id ?? null;

    const handleAdd: SubmitHandler<SessionFormValue> = async (data) => {
        if (!workoutLogId || !exerciseId || !startTimeStamp) {
            return toast.error("Missing workout, exercise, or session start time");
        }

        try {
            await addSession({
                workoutLogId,
                exerciseId,
                startTime: startTimeStamp,
                endTime: endTimeStamp ?? new Date().toISOString(),
                sets: Number(data.sets),
                reps: Number(data.reps),
                weight: Number(data.weight),
                completed: true
            });

            toast.success("Workout session saved!");
            setOpen(true);
            // navigate(`/workout/${workoutId}`);
        } catch (error) {
            console.error(error);
            toast.error("Unable to save session");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleAdd)} className="flex flex-col flex-1 gap-3">
                <SessionFieldSet register={register} />

                <div className="flex flex-1" />

                <div className="flex gap-2 w-full">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-stone-100 w-full">
                        Add
                    </Button>

                    <Button type="button" className="w-full" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </form>
            {open && <WorkoutCompletedWidget open={open} setOpen={setOpen} />}
        </>
    );
};