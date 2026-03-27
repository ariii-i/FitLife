import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { Greeting } from "@/widget/greetings/ui";
import { StreakView } from "@/widget/streak-view/ui";
import { WorkoutList } from "@/widget/workout/workout-list";
import { useEffect, useState } from "react";
import { auth } from "../../shared/lib/firebase";

export const HomePage = () => {
    const { user, } = useUserStore()
    const { fetchWorkouts, workouts } = useWorkoutStore();
    const { fetchWorkoutLogs } = useWorkoutLogStore();
    const { exercises, fetchExercises } = useExerciseStore()

    const currentUser = auth.currentUser
    useEffect(() => {
        if (user) {
            fetchWorkoutLogs(user?.uid)
        }
        fetchWorkouts()
        fetchExercises(user?.uid ?? "")
    }, [])

    const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
    const muscleGroups = [...new Set(exercises.map(e => e.muscle_group))];

    const filteredExercises = selectedMuscle === "all" ? exercises : exercises.filter(e => e.muscle_group === selectedMuscle);

    return (
        <div>
            <Greeting />
            <StreakView/>

            {/* <DisplayWorkoutList />  */}

            <div className="py-2 font-semibold flex justify-between">
                Today's Workout:

                <select onChange={(e) => setSelectedMuscle(e.target.value)} className="border px-2 rounded-md">
                    <option value="all">All</option>

                    {muscleGroups.map((muscle) => (
                        <option key={muscle} value={muscle}>
                            {muscle}
                        </option>
                    ))}
                </select>

            </div>
            <WorkoutList filteredExercises={filteredExercises} />
        </div>
    )
}