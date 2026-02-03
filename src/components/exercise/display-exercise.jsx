import { useExerciseStore } from "../../store/excersiseStore";
import { Card, CardContent, CardDescription } from "../ui/card";

export function DisplayExercises() {

    const { exercises } = useExerciseStore()

    if (!exercises || exercises.length === 0) {
        return (
            <div className="w-full  mt-3 ">
                <Card className="flex items-center justify-center p-6">
                    <CardContent className="text-xl font-semibold">
                        No exercises added
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <ul className="rounded-sm overflow-hidden">
            <CardDescription>
                {exercises.length} plans </CardDescription>
            {exercises.map((ex) => (
                <li key={ex._id} className="border-b border-stone-300">
                        <CardContent className="flex flex-col  justify-center px-3 py-6 ">
                            <div className="text-xl font-semibold ">{ex.name}
                            </div>
                        </CardContent>
                </li>
            ))}
        </ul>
    )
}