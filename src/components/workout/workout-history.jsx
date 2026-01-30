import { useExerciseStore } from "../../store/excersiseStore";
import { Card, CardContent, CardTitle } from "../ui/card";

export function WorkoutHistory() {
    const { exercises } = useExerciseStore();
    

    return (
        <div>
            <div>
                {exercises.map((ex) => (
                    <Card>
                        <CardContent> 
                            <CardTitle>

                                {ex.name}</CardTitle>

                        </CardContent>
                    </Card>))}

            </div>
        </div>
    )
}