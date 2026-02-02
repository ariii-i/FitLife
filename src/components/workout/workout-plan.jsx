import { Plus, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription } from "../ui/card";
import { useWorkoutStore } from "../../store/workoutStore";

export function WorkoutPlan() {

    const { workouts } = useWorkoutStore();

    if (workouts.length === 0) {
        return (
            <div className="space-y-2">
                <Card className="text-center">
                    <CardContent >
                        <SquarePen className="content-center" />
                        <CardDescription>No workout plans yet. </CardDescription>

                        <Button variant="secondary"><Plus />Create your first plan</Button>

                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="space-y-2">
            
            <pre>
                {JSON.stringify(workouts, null, 2)}
            </pre>
            {/* {workouts.map((w) => (
                <div key={w._id} className="border-b border-stone-300 py-3 font-semibold text-xl">
                    {w.name}
                </div>
            ))} */}

        </div>
    )
}