import { Input } from "@/components/ui/input"

export const ExerciseField=({register}:{
    register:any
})=>{
    return(
        <Input {...register("exercise")} placeholder="e.g. Bench Press" /> 
    )
}