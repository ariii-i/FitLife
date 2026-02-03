// import { Dumbbell, Plus, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { useExerciseStore } from "../../../store/excersiseStore";
// import { useWorkoutStore } from "../../../store/workoutStore";
// import { Button } from "../../ui/button";
// import { Card, CardContent } from "../../ui/card";
// import {
//     Drawer,
//     DrawerContent,
//     DrawerTitle,
//     DrawerTrigger
// } from "../../ui/drawer";
// import { Input } from "../../ui/input";

// export function WorkoutForm() {
//     const { exercises } = useExerciseStore();
//     const { workouts, addWorkouts } = useWorkoutStore();
//     const { addWorkoutExercises } = useExerciseStore();

//     const { register, handleSubmit, reset, setValue, watch } = useForm();
//     const [exerciseList, setExerciseList] = useState([]);
//     const [selectedExercise, setSelectedExercise] = useState(null)

//     const currentSets = watch("plannedSets");
//     const currentReps = watch("plannedReps")

//     const onSubmit = async (data) => {
//         console.log(data)
//         if (!data.name) {
//             toast.error("Please enter  workout name");
//             return;
//         }
//         if (exerciseList.length === 0) {
//             toast.error("Please add atleast one exercise.")
//             return;
//         }

//         try {
//             const workout = await addWorkouts(data.name.trim())
//             const promises = exerciseList.map((ex) => addWorkoutExercises({
//                 workoutId: workout._id,
//                 exerciseId: ex.exerciseId,
//                 plannedSets: ex.plannedSets,
//                 plannedReps: ex.plannedReps
//             }))

//             await Promise.all(promises);
//             reset();

//             setExerciseList([]),
//                 setSelectedExercise(null);
//         }
//         catch (error) {
//             console.log("Failed to create workout", error);
//         }
//         // createe wk
//         // getwk id
//         // we have list of exercise, sets, reps
//         // attach w id to each item
//         // creae mapped item bulk
//     }

//     const handleAddExercises = () => {
//         if (!selectedExercise) {
//             toast.error("Please select an exercise")
//             return;
//         } else if (!currentSets) {
//             toast.error("Please input number of sets")
//             return;
//         } else if (!currentReps) {
//             toast.error("Please input number of reps")
//             return;
//         }

//         const alreadyAdded = exerciseList.find((item) => {
//             item.exerciseId === selectedExercise._id
//         });
//         if (alreadyAdded) {
//             toast.error("his exercise is already added");
//             return
//         }

//         const newExercise = {
//             exerciseId: selectedExercise._id,
//             exerciseName: selectedExercise,
//             plannedSets: Number(currentSets),
//             plannedSets: Number(currentReps)
//         }

//         setExerciseList([...exerciseList, newExercise]);
//         setSelectedExercise(null);
//         reset({ plannedSets: "", plannedReps: "" });
//     };

//     const handleRemoveExercise = (id) => {
//         setExerciseList(exerciseList.filter((ex) => ex.exerciseId !== id))
//     }

//     return (
//         <Drawer direction="left" className="max-w-screen-md" >
//             <div className="flex justify-between">
//                 <div className="flex gap-3">
//                     <Button ><Dumbbell /> </Button>

//                     <DrawerTrigger asChild>
//                         <Button><Plus /> </Button>
//                     </DrawerTrigger>
//                 </div>
//             </div>





//             <DrawerContent className="max-w-screen-md px-2 content-center">
//                 <div>
//                     <DrawerTitle>
//                         Create workout plan
//                     </DrawerTitle>
//                     <p>
//                         Build your own custom workout routines.
//                     </p>
//                 </div>

//                 <div>
//                     <form>
//                         <div>
//                             <label>Workout Name</label>
//                             <Input {...register("name", { required: true })} type="text" placeholder="e.g. leg day" />
//                         </div>

//                         <div>
//                             <div>
//                                 {exerciseList.length} {exerciseList.length <= 1 ? 'exercise' : 'exercises'}
//                             </div>

//                             <div>
//                                 <pre>
//                                     {JSON.stringify(exerciseList, null, 2)}

//                                 </pre>
//                                 {exerciseList.map((ex, index) => (
//                                     <Card key={ex.exerciseId}>
//                                         <CardContent>
//                                             <div>
//                                                 {index + 1}
//                                                 <p>{ex.exerciseName}</p>

//                                             </div>

//                                             <div>
//                                                 {ex.plannedSets} sets
//                                                 {ex.plannedReps} reps
//                                             </div>

//                                             <div>
//                                                 <Button variant="destructive"><Trash2 /></Button>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                             </div>

//                         </div>

//                     </form>
//                 </div>


//                 <div>
//                     <label>
//                         Select an exersise
//                     </label>



//                 </div>

//             </DrawerContent>
//         </Drawer >
//     )
// }