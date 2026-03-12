import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { Exercise } from "@/entities/exercise/modal/types"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { ExerciseFieldSet } from "./field-set"

type FormValue = {
    exercise: string;
}

type ExerciseFormProp = {
    open: boolean
    setOpen: (open: boolean) => void
    selectedExercise?: Exercise
}

export const ExerciseForm = ({ open, setOpen, selectedExercise }: ExerciseFormProp) => {
    const { createExercise, fetchExercises } = useExerciseStore();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, reset, setValue } = useForm<FormValue>()

    const handleAdd: SubmitHandler<FormValue> = async (data) => {
        if (isSubmitting) return;

        if (!data.exercise?.trim()) {
            toast.error("Please enter exercies name.")
            return
        };

        try {
            setIsSubmitting(true)
            await createExercise(data.exercise);
            toast.success("Exercise added!")
            setOpen(false)
            fetchExercises()
            reset()
        } catch (error) {
            toast.error("Failed to add exercise.");
            setIsSubmitting(false);
        }
    }
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-2 h-full flex flex-col">
                <DrawerTitle>
                    Exercises
                </DrawerTitle>

                <form className="space-y-2 flex flex-col flex-1" onSubmit={handleSubmit(handleAdd)}>
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