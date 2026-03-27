import { useState } from "react"
import { Input } from "../../../../components/ui/input"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { When } from "react-if"

export const NameField = ({ register }: {
    register: any
}) => {
    return (
        <div>
            <label className="text-sm text-stone-500">Name</label>
            <Input {...register("name")} placeholder="e.g. Bench Press" />
        </div>
    )
}

export const DesciptionField = ({ register }: {
    register: any
}) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-500">description</label>

            <Input {...register("description")} placeholder="Give description about the exercise" />
        </div>
    )
}

export const MuscleGroupField = ({ register }: {
    register: any
}) => {
    const { exercises } = useExerciseStore()
    const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
    const muscleGroups = [...new Set(exercises.map(e => e.muscle_group))];

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-500">Muscle Group</label>

            <select onChange={(e) => setSelectedMuscle(e.target.value)} className="border p-2 rounded-md">
                {muscleGroups.map((muscle) => (
                    <option key={muscle} value={muscle}>
                        {muscle}
                    </option>
                ))}

                <option value="others">Others:</option>
            </select>

            <When condition={selectedMuscle === "others"}>
                <Input {...register("muscle_group")} placeholder="e.g. Chest" />

            </When>
        </div>
    )
}