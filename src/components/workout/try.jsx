// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerDescription,
//     DrawerTitle,
//     DrawerTrigger,
// } from "../ui/drawer";
// import { Button } from "../ui/button";
// import { useForm } from "react-hook-form";
// import { Input } from "../ui/input";
// import { useExerciseStore } from "../../store/excersiseStore";
// import { Card, CardContent } from "../ui/card";
// import { useEffect, useState } from "react";
// import { Plus, Trash2, Check, Dumbbell, Search } from "lucide-react";
// import { useWorkoutStore } from "../../store/workoutStore";
// import { useWorkoutExerciseStore } from "../../store/workout-exercise";

// export function TryWorkoutForm() {
//     const { exercises } = useExerciseStore();
//     const { workouts, addWorkouts } = useWorkoutStore();
//     const { addWorkoutExercises } = useWorkoutExerciseStore();
    
//     const { register, handleSubmit, reset, watch } = useForm();
    
//     const [exerciseList, setExerciseList] = useState([]);
//     const [selectedExercise, setSelectedExercise] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const currentSets = watch("plannedSets");
//     const currentReps = watch("plannedReps");

//     // Filter exercises based on search
//     const filteredExercises = exercises.filter(ex =>
//         ex.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleAddExercise = () => {
//         if (!selectedExercise || !currentSets || !currentReps) {
//             alert("Please select an exercise and enter sets and reps");
//             return;
//         }

//         const alreadyAdded = exerciseList.find(
//             (item) => item.exerciseId === selectedExercise._id
//         );

//         if (alreadyAdded) {
//             alert("This exercise is already added to the workout");
//             return;
//         }

//         const newExercise = {
//             exerciseId: selectedExercise._id,
//             exerciseName: selectedExercise.name,
//             plannedSets: parseInt(currentSets),
//             plannedReps: parseInt(currentReps),
//         };

//         setExerciseList([...exerciseList, newExercise]);
//         setSelectedExercise(null);
//         reset({ plannedSets: "", plannedReps: "" });
//     };

//     const handleRemoveExercise = (exerciseId) => {
//         setExerciseList(exerciseList.filter((ex) => ex.exerciseId !== exerciseId));
//     };

//     const onSubmit = async (data) => {
//         if (!data.name || !data.name.trim()) {
//             alert("Please enter a workout name");
//             return;
//         }

//         if (exerciseList.length === 0) {
//             alert("Please add at least one exercise to the workout");
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const workout = await addWorkouts(data.name.trim());
            
//             const promises = exerciseList.map((exercise) =>
//                 addWorkoutExercises({
//                     workoutId: workout._id,
//                     exerciseId: exercise.exerciseId,
//                     plannedSets: exercise.plannedSets,
//                     plannedReps: exercise.plannedReps,
//                 })
//             );

//             await Promise.all(promises);

//             reset();
//             setExerciseList([]);
//             setSelectedExercise(null);
//             setSearchTerm("");
//             setDrawerOpen(false);

//             alert("Workout plan created successfully!");
//         } catch (error) {
//             console.error("Error creating workout:", error);
//             alert("Failed to create workout. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Drawer direction="left" open={drawerOpen} onOpenChange={setDrawerOpen}>
//             {/* Header Section */}
//             <div className="flex justify-between items-center p-4 bg-gradient-to-r from-background to-muted/20">
//                 <div>
//                     <h2 className="text-lg font-semibold">Workout Plans</h2>
//                     <DrawerDescription className="text-sm">
//                         {workouts.length} {workouts.length === 1 ? 'plan' : 'plans'} created
//                     </DrawerDescription>
//                 </div>

//                 <div className="flex gap-2">
//                     <Button variant="secondary">
//                         <Dumbbell className="mr-2 h-4 w-4" />
//                         Quick Log
//                     </Button>
//                     <DrawerTrigger asChild>
//                         <Button>
//                             <Plus className="mr-2 h-4 w-4" />
//                             New Plan
//                         </Button>
//                     </DrawerTrigger>
//                 </div>
//             </div>

//             {/* Drawer Content */}
//             <DrawerContent className="h-screen max-w-lg ">
//                 {/* Drawer Header */}
//                 <div className="px-6 py-4 border-b">
//                     <DrawerTitle className="text-2xl font-bold">
//                         Create Workout Plan
//                     </DrawerTitle>
//                     <p className="text-sm text-muted-foreground mt-1">
//                         Build your custom workout routine
//                     </p>
//                 </div>

//                 {/* Form Container */}
//                 <div className="flex-1 overflow-hidden flex flex-col overflow-y-auto">
//                     <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
//                         <div className="flex-1 px-6 py-4">
//                             <div className="space-y-6">
//                                 {/* Workout Name Input */}
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-semibold text-foreground">
//                                         Workout Name *
//                                     </label>
//                                     <Input
//                                         {...register("name", { required: true })}
//                                         type="text"
//                                       placeholder="e.g., Leg Day, Upper Body Push"
//                                         className="h-11"
//                                     />
//                                 </div>


//                                 {/* Added Exercises Section */}
//                                 {exerciseList.length > 0 && (
//                                     <div className="space-y-3">
//                                         <div className="flex items-center justify-between">
//                                             <label className="text-sm font-semibold text-foreground">
//                                                 Exercises in Workout
//                                             </label>
//                                             <Button variant="secondary" className="text-xs">
//                                                 {exerciseList.length} {exerciseList.length === 1 ? 'exercise' : 'exercises'}
//                                             </Button>
//                                         </div>
                                        
//                                         <div className="space-y-2">
//                                             {exerciseList.map((ex, index) => (
//                                                 <Card key={ex.exerciseId} className="border-l-4 border-l-primary">
//                                                     <CardContent className="p-4">
//                                                         <div className="flex items-start justify-between">
//                                                             <div className="flex-1">
//                                                                 <div className="flex items-center gap-2 mb-1">
//                                                                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
//                                                                         {index + 1}
//                                                                     </span>
//                                                                     <p className="font-semibold text-base">
//                                                                         {ex.exerciseName}
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="flex gap-3 ml-8 mt-1">
//                                                                     <Button variant="outline" className="font-normal">
//                                                                         {ex.plannedSets} sets
//                                                                     </Button>
//                                                                     <Button variant="outline" className="font-normal">
//                                                                         {ex.plannedReps} reps
//                                                                     </Button>
//                                                                 </div>
//                                                             </div>
//                                                             <Button
//                                                                 type="button"
//                                                                 variant="ghost"
//                                                                 size="sm"
//                                                                 onClick={() => handleRemoveExercise(ex.exerciseId)}
//                                                                 className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                                                             >
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             </Button>
//                                                         </div>
//                                                     </CardContent>
//                                                 </Card>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* <Separator /> */}

//                                 {/* Add Exercise Section */}
//                                 <div className="space-y-4">
//                                     <label className="text-sm font-semibold text-foreground">
//                                         Add Exercise
//                                     </label>

//                                     {/* Search Bar */}
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                         <Input
//                                             type="text"
//                                             placeholder="Search exercises..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="pl-10 h-11"
//                                         />
//                                     </div>

//                                     {/* Exercise Selection Grid */}
//                                     <div className="space-y-2 overflow-y-auto">
//                                         <p className="text-xs text-muted-foreground">
//                                             Select an exercise below
//                                         </p>
//                                         <div className="h-64 rounded-md border p-2">
//                                             <div className="space-y-2">
//                                                 {filteredExercises.length === 0 ? (
//                                                     <div className="flex flex-col items-center justify-center h-40 text-center">
//                                                         <p className="text-sm text-muted-foreground">
//                                                             No exercises found
//                                                         </p>
//                                                         <p className="text-xs text-muted-foreground mt-1">
//                                                             Try a different search term
//                                                         </p>
//                                                     </div>
//                                                 ) : (
//                                                     filteredExercises.map((ex) => {
//                                                         const isSelected = selectedExercise?._id === ex._id;
//                                                         const isAdded = exerciseList.some(
//                                                             item => item.exerciseId === ex._id
//                                                         );
                                                        
//                                                         return (
//                                                             <Card
//                                                                 key={ex._id}
//                                                                 onClick={() => !isAdded && setSelectedExercise(ex)}
//                                                                 className={`cursor-pointer transition-all ${
//                                                                     isAdded
//                                                                         ? "opacity-50 cursor-not-allowed bg-muted"
//                                                                         : isSelected
//                                                                         ? "border-primary bg-primary/5 shadow-md"
//                                                                         : "hover:bg-accent hover:shadow-sm"
//                                                                 }`}
//                                                             >
//                                                                 <CardContent className="p-3">
//                                                                     <div className="flex items-center justify-between">
//                                                                         <p className="font-medium text-sm">
//                                                                             {ex.name}
//                                                                         </p>
//                                                                         {isSelected && (
//                                                                             <Check className="h-4 w-4 text-primary" />
//                                                                         )}
//                                                                         {isAdded && (
//                                                                             <Button variant="secondary" className="text-xs">
//                                                                                 Added
//                                                                             </Button>
//                                                                         )}
//                                                                     </div>
//                                                                 </CardContent>
//                                                             </Card>
//                                                         );
//                                                     })
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Sets & Reps Input */}
//                                     <Card className={`${selectedExercise ? 'border-primary' : 'border-dashed'}`}>
//                                         <CardContent className="p-4 space-y-4">
//                                             <div className="flex items-center gap-2">
//                                                 <div className="h-2 w-2 rounded-full bg-primary" />
//                                                 <p className="text-sm font-semibold">
//                                                     {selectedExercise
//                                                         ? `Configure ${selectedExercise.name}`
//                                                         : "Select an exercise to configure"}
//                                                 </p>
//                                             </div>

//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div className="space-y-2">
//                                                     <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                                         Sets
//                                                     </label>
//                                                     <Input
//                                                         {...register("plannedSets")}
//                                                         type="number"
//                                                         min={1}
//                                                         placeholder="4"
//                                                         disabled={!selectedExercise}
//                                                         className="h-12 text-center text-lg font-semibold"
//                                                     />
//                                                 </div>

//                                                 <div className="space-y-2">
//                                                     <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                                         Reps
//                                                     </label>
//                                                     <Input
//                                                         {...register("plannedReps")}
//                                                         type="number"
//                                                         min={1}
//                                                         placeholder="12"
//                                                         disabled={!selectedExercise}
//                                                         className="h-12 text-center text-lg font-semibold"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <Button
//                                                 type="button"
//                                                 variant="secondary"
//                                                 className="w-full h-11"
//                                                 onClick={handleAddExercise}
//                                                 disabled={!selectedExercise || !currentSets || !currentReps}
//                                             >
//                                                 <Plus className="mr-2 h-4 w-4" />
//                                                 Add to Workout
//                                             </Button>
//                                         </CardContent>
//                                     </Card>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Footer Actions */}
//                         <div className="border-t p-6 bg-muted/20 space-y-3">
//                             <Button
//                                 type="submit"
//                                 className="w-full h-12 text-base font-semibold"
//                                 disabled={isSubmitting || exerciseList.length === 0}
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <span className="mr-2">Creating...</span>
//                                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Check className="mr-2 h-5 w-5" />
//                                         Save Workout Plan
//                                     </>
//                                 )}
//                             </Button>

//                             <DrawerClose asChild>
//                                 <Button variant="outline" className="w-full h-11" disabled={isSubmitting}>
//                                     Cancel
//                                 </Button>
//                             </DrawerClose>
//                         </div>
//                     </form>
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     );
// }