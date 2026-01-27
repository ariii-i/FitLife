// import { ListChecks } from "lucide-react";
// import { useExerciseStore } from "../../store/excersiseStore";
// import { useExerciseLogStore } from "../../store/exercise-log-store";
// import { useWorkoutStore } from "../../store/workout-Store";

// export function WorkoutCards() {
//     const { workouts } = useWorkoutStore();
//     const { toggleExercise, isExerciseCompleted } = useExerciseLogStore()

//     return (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3py-6 py-2">
//             {workouts.map((w) => {
//                 const completedCount = w.exercises?.filter(ex => isExerciseCompleted(w._id, ex._id)).length || 0

//                 const total = w.exercises?.length || 0
//                 const workoutCompleted = total > 0 && completedCount === total
//                 console.log(workoutCompleted)

//                 return (
//                     <div className=" bg-teal-900 text-white rounded-xl p-4 shadow ">
//                         {workouts.length > 0 ? (
//                             <div key={w._id}>
//                                 <h2 className="font-semibold text-lg space-y-2">{w.title}</h2>
//                                 <div className="text-sm py-2">
//                                     <p>
//                                         Day: {w.day}
//                                     </p>
//                                     <p>
//                                         Progress: {completedCount}/{total}
//                                     </p>
//                                 </div>
                                
//                                 <div>
//                                     <p className="font-semibold">Exercises</p>
//                                     {total ? (
//                                         <ul>
//                                             {w.exercises.map((ex) => {
//                                                 const done = isExerciseCompleted(w._id, ex._id)
//                                                 return (
//                                                     <li key={ex._id}>
//                                                         <input type="checkbox" checked={done}
//                                                             onChange={() => toggleExercise(w._id, ex._id)}
//                                                         />
//                                                         <span className={`px-2 ${done ? "line-through opacity-70" : ""}`}>{ex.name}</span>
//                                                     </li>
//                                                 )
//                                             })}
//                                         </ul>
                                        
//                                     ) : <div className="text-sm">
//                                         No exercises added
//                                     </div>}
//                                 </div>

//                                 <div>
//                                     {workoutCompleted ? (
//                                         <div className="text-green-500 font-semibold text-sm">
//                                             Completed, you did a great job!
//                                         </div>
//                                     ): null}
//                                     </div>
//                             </div>) : (<div className="flex flex-col justify-center text-lg font-semibold px-3 py-4">
//                                 <ListChecks size={40} />
//                                 No workout plans yet. Create your first one </div>
//                         )}
//                     </div>
//                 )
//             })}
//         </div>
//     )
// }