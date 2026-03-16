import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { SessionFieldSet } from "./field-set";

type SessionFormValue = {
    sets: number;
    reps: number;
    weight: number;
};

export const SessionForm = ({ startTimeStamp }: { startTimeStamp: string | null }) => {
    const { workoutId, exerciseId } = useParams<{ workoutId: string; exerciseId: string }>();
    const navigate = useNavigate();

    const { addSession, workoutLogs } = useWorkoutLogStore();
    const { register, handleSubmit } = useForm<SessionFormValue>();

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
                endTime: new Date().toISOString(),
                ...data,
            });

            toast.success("Workout session saved!");
            navigate(`/workout/${workoutId}`);
        } catch (error) {
            console.error(error);
            toast.error("Unable to save session");
        }
    };

    return (
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
    );
};