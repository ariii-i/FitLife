// import { Input } from "@/components/ui/input";
// import { useUserStore } from "@/entities/user/modal/store";
// import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
// import { useWorkoutStore } from "@/entities/workout/modal/store";

// export const DisplayWorkoutList = () => {
//     const { workouts, workout } = useWorkoutStore();
//     const { user } = useUserStore();
//     const { updateWorkoutLog } = useWorkoutLogStore();

//     return (
//         <div className="space-y-4">
//             <p className="font-semibold text-lg">Today's Workouts</p>

//             {workouts.length === 0 && (
//                 <p className="text-sm text-stone-500">No workouts available</p>
//             )}

//             {workouts.map((work) => (
//                 <div key={work._id} className="border rounded-xl p-3 space-y-2 bg-stone-100 shadow-sm">
//                     <div className="flex justify-between items-center">
//                         <p className="font-semibold text-md">{work.name}</p>
//                     </div>

//                     <div className="space-y-1">
//                         {workout?.exercises?.map((we) => (
//                             <div
//                                 key={we.id}
//                                 className="flex items-center gap-3 border p-2 rounded-lg"
//                             >
//                                 <Input
//                                     type="checkbox"
//                                     className="w-4 h-4"
//                                     onChange={async () => {
//                                         if (!user?.uid) return;
//                                         await updateWorkoutLog(user.uid, workout);
//                                     }}
//                                 />

//                                 <div className="flex flex-col text-sm font-semibold">
//                                     {we.name}
//                                     <p className="text-xs text-stone-500 font-normal">
//                                         {we.sets} sets x {we.reps} reps
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )

// };