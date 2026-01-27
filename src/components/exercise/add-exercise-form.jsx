"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useExerciseStore } from "../../store/excersiseStore";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddExercisesForm() {
    const { register, handleSubmit, reset } = useForm();
    const { addExercise, fetchExercises } = useExerciseStore();
    const [open, setOpen] = React.useState(false);

    const onSubmit = async (data) => {
        await addExercise(data, async () => await fetchExercises());
        reset();
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <span>
                    <Button variant="default" className="bg-stone-900 text-white rounded-xl px-3 py-2 hover:bg-stone-950">Add Exercise</Button>
                </span>
            </DrawerTrigger>

            <DrawerContent className="fixed inset-0 z-50 flex items-center justify-center">

                <div className="bg-stone-100 p-6 rounded-xl shadow-lg w-full max-w-md">
                    <DrawerHeader className="flex justify-between items-center">
                        <DrawerTitle>Add New Exercise</DrawerTitle>

                        <DrawerClose asChild>
                            <Button variant="destructive">Close</Button>
                        </DrawerClose>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 pt-4">
                        <Input 
                            {...register("name")} 
                            placeholder="Exercise Name" 
                            className="rounded-xl" />

                        <Input 
                            {...register("muscleGroup")} 
                            placeholder="Muscle Group" 
                            className="rounded-xl" />

                        <Input 
                            {...register("equipment")} 
                            placeholder="Equipment" 
                            className="rounded-xl" />

                        <Button 
                            type="submit" 
                            className="bg-stone-900 hover:bg-stone-950 text-white rounded-xl">
                            Add Exercise
                        </Button>

                    </form>
                </div>
                
            </DrawerContent>
        </Drawer>
    );
}
