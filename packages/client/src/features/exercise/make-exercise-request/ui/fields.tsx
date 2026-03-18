import { Input } from "../../../../components/ui/input"

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

            <Input {...register("description")} placeholder="e.g. Bench Press" />
        </div>
    )
}

export const MuscleGroupField = ({ register }: {
    register: any
}) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-500">Muscle Group</label>

            <Input {...register("muscle_group")} placeholder="e.g. Bench Press" />

        </div>
    )
}