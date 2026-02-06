import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form"
import { useWorkoutLogStore } from "../../store/workoutLogStore";

export const SessionForm = () => {
    const {workoutLog}=useWorkoutLogStore()
    console.log("workoutLog", workoutLog)
    const { register, handleSubmit } = useForm()
    return (
        <div>
            <form>
                Sets Completed
                <Input type="number" {...register(`session.[index].sets`)}/>
                <Button type="submit">Log Session</Button>
            </form>
        </div>
    )
}