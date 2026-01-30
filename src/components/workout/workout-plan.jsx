import { Plus, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { useWorkoutStore } from "../../store/workoutStore";

export function WorkoutPlan() {

    const { workouts } = useWorkoutStore();

    if (workouts.length === 0) {
        return (
            <div className="space-y-2">

                <div>
                    <Card className="text-center">
                        <CardContent >
                            <SquarePen className="content-center" />
                            <CardDescription>No workout plans yet. </CardDescription>

                            <Button variant="secondary"><Plus />Create your first plan</Button>

                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-2">
            {workouts.map((w) => (
                <div>
                    <Card>
                        <CardContent>
                            <CardTitle>{w.name}</CardTitle>
                        </CardContent>
                    </Card>
                    </div>
            ))}

        </div>
    )
}