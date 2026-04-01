import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ConnectForm } from "@/custom-components/ui/connect-form";
import { FormProvider } from "@/custom-components/ui/form-provider";
import { useWorkoutSessionStore } from "@/entities/workout-session/modal/store";
import { auth } from "@/shared/lib/firebase";
import { SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Schema_Workout_Session } from "server/src/orpc-server/packages/workout/domain/schema-workout-session";
import { toast } from "sonner";
import z from "zod";
import { SessionFieldSet } from "./field-set";

type FormValue = z.infer<typeof Schema_Workout_Session>;

export const SessionForm = ({ openDrawer, setOpenDrawer, startTimeStamp, endTimeStamp }: {
    openDrawer: boolean,
    setOpenDrawer: (openDrawer: boolean) => void;
    startTimeStamp: string
    endTimeStamp: string
}) => {
    const { workoutId, exerciseId } = useParams<{
        workoutId: string;
        exerciseId: string;
    }>();
    const navigate = useNavigate();

    const { createSession } = useWorkoutSessionStore();


    const handleSubmitSession: SubmitHandler<FormValue> = async (data) => {
        if (!startTimeStamp || !endTimeStamp)
            return toast.error("Session timestamps missing");

        try {
            const start = new Date(startTimeStamp);
            const end = new Date(endTimeStamp);
            const durationMinutes = Math.ceil(
                (end.getTime() - start.getTime()) / 60000,
            );

            const payload = {
                ...data,
                user_id: auth.currentUser?.uid || "",
                workout_id: Number(workoutId),
                duration_minutes: durationMinutes,
                performed_at: startTimeStamp,
                exercise_id: Number(exerciseId)
            }

            await createSession(payload);

            toast.success("Session saved!");
            navigate(`/workout-completed`, { state: payload });
        } catch (error) {
            console.error(error);
            toast.error("Failed to save session");
        }
    };
    return (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
            <DrawerContent className="bg-gray-900 border-gray-900">
                <FormProvider defaultValues={{}} className="flex flex-col flex-1" onSubmit={handleSubmitSession}>

                    <DrawerHeader className="gap-1">
                        <DrawerTitle className="text-white">
                            Session Complete
                        </DrawerTitle>
                    </DrawerHeader>

                    <SessionFieldSet />

                    <DrawerFooter>
                        <ConnectForm<FormData>>
                            {({ formState }) => {
                                return (
                                    <Button
                                        type="submit"
                                        className="bg-emerald-800 hover:bg-emerald-700 hover:text-white"
                                    >
                                        {formState.isSubmitting ? "Add..." : "Add"}
                                    </Button>
                                );
                            }}
                        </ConnectForm>

                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                className="bg-gray-600 border-0 text-white hover:bg-gray-500 hover:text-white"
                            >
                                Done
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </FormProvider>
            </DrawerContent>
        </Drawer>
    )
}