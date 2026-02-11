import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { Button } from "../components/ui/button";

export const WorkoutDetail = () => {

  // 1. extract workoutID from params 
  const { workoutId } = useParams();
  const navigate=useNavigate();

  // 2. call fetchDetail in use effect, fetch details should return resonse.
  // 3. store response in use state
  const [workoutDetail, setWorkoutDetail] = useState(null)
  const { fetchDetail } = useWorkoutExerciseStore();

  const init = React.useCallback(async () => {
    const data = await fetchDetail(workoutId)
    console.log({ data })
    setWorkoutDetail(data)
  }, [workoutId])

  React.useEffect(() => {
    init()

  }, [init])


  // 4. if response is empty show empty case
  if (!workoutDetail) {
    <p>
      No workouts available. Create your own Workouts.
    </p>
  }
  console.log("workout id detail ", workoutDetail)

  // 5. else dispay response
  return (
    <div className="space-y-2">
      <ul className="space-y-2">

        {workoutDetail?.map((w) => (
          <li key={w._id} className="border border-dashed rounded-xl p-2 text-sm">
            <Link to={`/workout-detail/${workoutId}/session/${w._id}`}>

              <h2 className="font-semibold text-md">{w.exercise.name}</h2>

              {w.plannedSets} sets x {w.plannedReps} reps

            </Link>
          </li>
        ))}
      </ul>

      <Button className="flex justify-self-end" variant="secondary" onClick={()=> navigate(`/workout-detail/${workoutId}/session/new`)}>Quick Session</Button>
    </div>
  )
};
