import { useEffect } from "react"
import { AddExercises } from "../../features/exercise/make-exercise-request/ui/create-exercises-button"
import { DisplayExercises } from "../../widget/exercise/display-exercise"
import { useExerciseStore } from "@/entities/exercise/modal/store"

export const Exercise : React.FC= () => {
    const { fetchExercises } = useExerciseStore()

    useEffect(() => {
        fetchExercises()
    }, [fetchExercises])

    return (
        <div>
            <div className="flex justify-between items-center font-semibold text-xl">
                Exercises
                <AddExercises />
            </div>
            <DisplayExercises />
        </div>
    )
}