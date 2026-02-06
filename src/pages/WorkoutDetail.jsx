import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { Layout } from "../components/layout/Layout"

export const WorkoutDetail = () => {

  // 1. extract workoutID from params 
  const { workoutId } = useParams();

  // 2. call fetchDetail in use effect, fetch details should return resonse.
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

  // 3. store response in use state

  // 4. if response is empty show empty case
  if (!workoutDetail) {
    <p>
      No workouts available. Create your own Workouts.
    </p>
  }
  console.log("workout id detail ", workoutDetail)
  
  // 5. else dispay response
  return (
    <div>
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
    </div>
  )

  // const workout = workouts.find((w) => {
  //   return String(w._id) === String(workoutId);
  // });

  // const exercise = workoutExercises.filter((we) => String(we.workout._id) === String(workoutId))
  // console.log("EXERCISE", exercise)

  // console.log(workout)

  // console.log('list', workouts)

  // return (
  //   <Layout>
  //     <h2>{workout.name || "Workouts"}</h2>
  //     <div>
  //       {exercise.map((e) =>
  //         <div>
  //           <pre>
  //             {JSON.stringify(exercise, null, 2)}
  //           </pre>
  //           {/* {e.exercise.name} */}
  //           <span>{e.plannedSets} x {e.plannedReps}</span>
  //         </div>
  //       )}
  //     </div>
  //   </Layout>
  // )
};
