import { Card, CardContent, } from "../../components/ui/card"
import { useExerciseStore } from "../../entities/exercise/store"

export const DisplayExercises = () => {
    const { exercises } = useExerciseStore()

    if (!exercises || exercises.length === 0) {
        return (
            <div>
                <Card className="flex flex-col items-center justify-center font-semibold p-4">
                    No exercise added.
                    <div>
                        Create a new one?
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <span className="text-xs text-gray-500">{exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}</span>
            {exercises.map((ex) => (
                <div key={ex._id} className="border-b border-dashed p-5 font-semibold">
                    {ex.name}
                </div>
            ))}
        </div>
    )
}