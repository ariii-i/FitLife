import { useEffect } from "react"
import { AddExercises } from "../../features/exercise/add-exercises"
import { DisplayExercises } from "../../widget/exercise/display-exercise"
import { useExerciseStore } from "../../entities/exercise/store"

export const Exercise = () => {
    const { fetchExercises } = useExerciseStore()

    useEffect(() => {
        fetchExercises()
    }, [])

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