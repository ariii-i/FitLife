import { Button } from "../../../shared/ui/button"
import { Card } from "../../../shared/ui/card"
import { Input } from "../../../shared/ui/input"
import { useWorkoutStore } from "../../../entities/workout/store"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useWorkoutLogStore } from "../../../entities/workout-log/store"
import { useForm } from "react-hook-form"
import { Drawer, DrawerContent, DrawerTitle } from "../../../shared/ui/drawer"

export const StopExercise = ({ open, setOpen, startTimeStamp }) => {
    const { workoutId, exerciseId } = useParams()
    const navigate = useNavigate();
    const { createWorkout, addSessionData, workoutLogs } = useWorkoutLogStore()
    const { register, handleSubmit, reset } = useForm();

    const handleAdd = async (data) => {
        // try {
        //     createWorkout(data, workoutId, exerciseId, startTimeStamp)
         await addSessionData(data, workoutLogs)
            

        //     toast.success("Workout added");
        //     navigate(`/workout/${workoutId}`);
        // } catch (error) {
        //     toast.error("Unable to add workout");
        // }
    }

    const handleSession = () => {
        <div></div>
    }
    const { workout } = useWorkoutStore();

    const selected = workout.exercises.find((ex) => ex.exercise._id === String(exerciseId))
    const remaining = workout.exercises.filter((rem) => rem.exercise._id !== String(exerciseId));
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-2 overflow-y-auto">

                <DrawerTitle>Planned Exercise</DrawerTitle>
                <div className="flex gap-3">
                    <Card className="bg-stone-700 text-stone-100 p-4 flex-[2] rounded-xl shadow-md font-semibold flex text-center justify-center items-center">
                        {selected.exercise.name}
                    </Card>

                    <Card className="bg-stone-800 text-stone-100 p-4 flex-1 rounded-xl shadow-md text-center">
                        <div className="text-xs text-stone-400">SETS</div>
                        <div className="text-lg font-bold text-stone-300">{selected.plannedSets}</div>
                    </Card>

                    <Card className="bg-stone-800 text-stone-100 p-4 flex-1 rounded-xl shadow-md text-center">
                        <div className="text-xs text-stone-400">REPS</div>
                        <div className="text-lg font-bold text-stone-300">{selected.plannedReps}</div>
                    </Card>

                </div>

                <DrawerTitle>Actual Exercise</DrawerTitle>
                <Card className="bg-stone-700 p-4 rounded-xl shadow-md">
                    <form onSubmit={handleSubmit(handleAdd)} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-stone-300">Sets</label>
                            <Input type="number" placeholder="Enter sets" {...register("sets")} className="bg-stone-600 text-stone-100 px-3 py-2 rounded" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-stone-300">Reps</label>
                            <Input type="number" placeholder="Enter reps" {...register("reps")} className="bg-stone-600 text-stone-100 px-3 py-2 rounded" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-stone-300">Weight</label>
                            <Input type="number" {...register("weight")} placeholder="Enter weight" className="bg-stone-600 text-stone-100 px-3 py-2 rounded" />
                        </div>

                        <div className="flex justify-end mt-2">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-stone-100 px-5 py-2 rounded-lg font-semibold transition">
                                Add
                            </Button>
                        </div>

                        
                    </form>
                </Card>

                <Link to="/">
                    <Button type="button" >
                        Back to Dashboard
                    </Button>
                </Link>

            </DrawerContent>
        </Drawer>
    )
}