import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,

} from "../ui/drawer";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useExerciseStore } from "../../store/excersiseStore";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { Plus } from "lucide-react";

export function WorkoutLog() {
    // const { logs, addLogs, updateLogs } = useWorkoutLogStore();
    const { exercises } = useExerciseStore();
    console.log("try", exercises)
    const { register, handleSubmit, reset, setValue } = useForm();

    const [selectedExercise, setSelectedExercise] = useState(null)

    const onSubmit=(data)=>{
        console.log(data)
        reset()
    }

    return (
        <Drawer direction="left">

            <div className="flex justify-between items-center p-2 ">
                <DrawerDescription>
                    plans
                </DrawerDescription>

                <DrawerTrigger asChild>
                    <Button variant="outline"><Plus /> Create a Workout Plan</Button>
                </DrawerTrigger>
            </div>


            <DrawerContent className="w-130 gap-3 px-4 py-6 h-screen">
                <DrawerTitle>Workout Plan</DrawerTitle>

                <div className="border rounded-md p-4 overflow-y-auto">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="text-sm font-medium">Workout Name</label>
                            <Input
                                {...register("name")}
                                type="text"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Exercises</label>
                            {exercises.map((ex) => (
                                <Card key={ex._id} onClick={() => {
                                    setSelectedExercise(ex)
                                    setValue("exerciseId", ex._id)}}  className={`space-y-3 ${selectedExercise?._id === ex._id ? "border-primary bg-primary/10" : "hover:bg-muted"}`}>
                                    <CardContent className="p-3 text-sm font-medium">
                                        {ex.name}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="border rounded-md shadow p-3 space-y-3">
                            <p className="text-sm font-medium">Exercise Details</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-sm">Sets</label>
                                    <Input {...register("sets")}
                                        type="number" min={0} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm">Reps</label>
                                    <Input {...register("reps")}
                                        type="number" min={1} />
                                </div>
                            </div>

                            <Button type="button" variant="secondary" >Add set</Button>

                        </div>
                        <Button type="submit" >Save Workout</Button>
                    </form>
                </div>

                <DrawerClose >
                    <Button>Close</Button>
                </DrawerClose>

            </DrawerContent>
        </Drawer >
    )
}