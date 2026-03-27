import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise"
import { toast } from "sonner"
import z from "zod"
import { useExerciseStore } from "../../../../entities/exercise/modal/store"
import { ExerciseFieldSet } from "./field-set"
import { Drawer, DrawerContent, DrawerTitle } from "../../../../components/ui/drawer"
import { Button } from "../../../../components/ui/button"
import { useUserStore } from "@/entities/user/modal/store"

type FormValue = z.infer<typeof Schema_Exercise>

export const ExerciseForm = ({ open, setOpen, selectedExercise }: {
    open: boolean
    setOpen: (open: boolean) => void
    selectedExercise?: z.infer<typeof Schema_Exercise>
}) => {
    const { createExercise, editExercise, fetchExercises } = useExerciseStore();
    const { user } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm<FormValue>()

    const handleSubmitExercise: SubmitHandler<FormValue> = async (data) => {
        if (isSubmitting) return;

        if (!data.name?.trim()) {
            toast.error("Please enter exercise name.");
            return;
        }

        try {
            setIsSubmitting(true);

            if (!user) {
                return
            }
            
            if (selectedExercise) {
                await editExercise({...data, user_id: user.uid});
                toast.success("Exercise updated!");
            } else {
                await createExercise({ ...data, user_id: user.uid});
                toast.success("Exercise added!");
            }

            await fetchExercises(user?.uid ?? "");
            reset();
            setOpen(false);

        } catch (error) {
            toast.error("Failed to save exercise.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-2 h-full flex flex-col">
                <DrawerTitle>
                    Exercises
                </DrawerTitle>

                <form className="space-y-2 mt-3 flex flex-col flex-1" onSubmit={handleSubmit(handleSubmitExercise)}>
                    <ExerciseFieldSet register={register} setValue={setValue} selectedExercise={selectedExercise} />

                    <div className="flex-1" />

                    <div className="flex gap-2 justify-end w-full">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {selectedExercise ? "Update" : "Add"}
                        </Button>

                        <Button className="w-full" type="button" onClick={() => setOpen(false)}>Close</Button>
                    </div>

                </form>
            </DrawerContent>
        </Drawer>
    )
}