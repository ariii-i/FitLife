import { useUserStore } from "../../entities/user/store";
import { Input } from "../../components/ui/input";
import { useWorkoutStore } from "../../entities/workout/store";
import { EllipsisVertical } from "lucide-react";
import { StreaksTrack } from "../../features/streaks";
import { useWorkoutLogStore } from "../../entities/workout-log/store";

export const Dashboard = () => {
    return (
        <div>
            <StreaksTrack />
            <DisplayWorkoutList />
        </div>
    )
}

const DisplayWorkoutList = () => {
    const { workouts } = useWorkoutStore();
    const { users } = useUserStore()
    const { workoutLogs, updateWorkoutLog } = useWorkoutLogStore()

    return (
        <div className="space-y-2">
            <p className="font-semibold">Today's Workout</p>

            {workouts.map((workout) => (
                <div key={workout._id} className="space-y-2">

                    {workout.exercises?.map((we) => (
                        <div key={we._id} className="flex items-center gap-3 border py-2 px-3 rounded-xl">
                            <Input type="checkbox" className="w-4 h-4" onChange={async () => {
                                await updateWorkoutLog(users._id, workout)
                            }} />

                            <div className="flex-col text-sm font-semibold">
                                {we.exercise.name}
                                <p className="text-xs text-gray-500 font-normal">
                                    {we.plannedSets} sets x {we.plannedReps} reps
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}