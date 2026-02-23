import { useNavigate } from "react-router-dom";
import { useWorkoutStore } from "../../entities/workout/store";
import { StreaksTrack } from "../../features/streaks";
import { DisplayWorkoutList } from "./display-workouts";

export const Dashboard = () => {
    const navigate=useNavigate()
    const { workouts, workout, fetchSelectedWorkout } = useWorkoutStore();

    return (
        <div>
            <StreaksTrack />
            {/* <DisplayWorkoutList /> */}
            <div className="space-y-2 font-semibold">
                Today's Workout:
                {workouts.map((w)=>(
                    <div className="border p-3 rounded-xl bg-white shadow-sm" onClick={()=>navigate(`/${w._id}`)}>
                        {w.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
