import { useState } from "react";
import { Button } from "../ui/button";
import { WorkoutPlan } from "./workout-plan";
import { WorkoutHistory } from "./workout-history";
import { Drawer, DrawerDescription } from "../ui/drawer";
import { useWorkoutStore } from "../../store/workoutStore";

export function WorkoutButton() {
    const {workouts}=useWorkoutStore();
    const [view, setView] = useState("plan");

    return (
        <div>
            <div>
                <Drawer>
                    <DrawerDescription>
                        {workouts.length} {workouts.length <= 1 ? 'plan' : 'plans'}
                    </DrawerDescription>
                </Drawer>
            </div>

            <div className="flex justify-center gap-3 space-y-2">
                <Button variant={view === "plan" ? "default" : "ghost"} onClick={() => setView("plan")}>
                    Workout Plan
                </Button>

                <Button variant={view === "history" ? "default" : "ghost"} onClick={() => setView("history")}>
                    Workout History
                </Button>
            </div>

            <div>
                {view === "plan" && <WorkoutPlan />}
                {view === "history" && <WorkoutHistory />}
            </div>
        </div>
    )
}