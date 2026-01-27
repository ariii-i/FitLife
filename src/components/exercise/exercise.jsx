import { useState } from "react";
import {useForm } from "react-hook-form";
import { useWorkoutLogStore } from "../../store/workout-Store";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { sanityClient } from "../../lib/sanity";

export function ExercisePlan(){
    const {addLogs}=useWorkoutLogStore();
    
    const {register, handleSubmit, reset}=useForm()
    
    const onSubmit = async (data) => {
        if(!data.exercise?.trim()){
            toast.error("Exercise name is required")
            return
        }
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create a plan</Button>
            </DialogTrigger>

            <DialogContent >
                <DialogDescription className="font-bold text-2xl">
                    Exercises
                </DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)} className="text-sm space-y-3">
                    <label>Exercise Name</label>
                    <Input {...register("Exercise")} placeholder="e.g. Bench Press" />

                    <Button type="submit" variant="outline">Add </Button>
                </form>

                <DialogClose>
                    <Button variant={"outline"}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )

}