import { EllipsisVertical, Trash2 } from "lucide-react";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise"
import { useWorkoutStore } from "../../../store/workoutStore";
import { Button } from "../../ui/button"
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom";

export const WorkoutField = () => {
    const { workouts, deleteWorkout } = useWorkoutStore();
    const { workoutExercises } = useWorkoutExerciseStore()

    const onDelete = async (id) => {
        toast.warning("Are you sure you want to delete this workout?", {
            action: {
                label: "Delete",
                onClick: () => {
                    deleteWorkout(id);
                    toast.success("Workout Deleted")
                }
            }
        })
    }

    const getSetsandReps = (workoutId) => {
        const exercises = workoutExercises.filter(
            (we) => we.workout._id === workoutId
        );

        if (!exercises.length) return "";

        let totalSets = 0;
        let totalReps = 0;

        exercises.forEach((ex) => {
            totalSets += ex.plannedSets;
            totalReps += ex.plannedReps;
        });

        return `(${totalSets} sets × ${totalReps} reps)`;
    };

    const navigate = useNavigate()

    return (
        <ul >
            {workouts.map((w) => (
                <li key={w._id} className="flex justify-between items-center border-b border-stone-300 py-6 px-3 font-semibold text-xl">
                    <Link to={`/workout-detail/:${w._id}`} rel="stylesheet" href="">
                        <div>{w.name}</div>
                    </Link>

                    {getSetsandReps(w._id)}
                    {/* <span className="text-xs block font-light">{getSetsandReps(w._id)}</span> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><EllipsisVertical /></Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem variant="ghost" className="w-full justify-start" onClick={() => navigate('/DetailsField')}>Details</DropdownMenuItem>
                            <DropdownMenuItem variant="ghost" className="w-full justify-start">Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(w._id)} variant="ghost" className="text-red-500 w-full justify-start">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            ))}
        </ul>
    )
}
