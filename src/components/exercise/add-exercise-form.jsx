import { useForm } from "react-hook-form"
import { useExerciseStore } from "../../store/excersiseStore";

export function AddExercisesForm() {
    const { register, handleSubmit, reset } = useForm();
    const { addExercise, fetchExercises } = useExerciseStore();

    const onSubmit = async (data) => {
        console.log("adding", data);
        await addExercise(data, async() => {
           debugger
            await fetchExercises()
        })
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 shadow rounded-xl px-3 py-2">
            <input type="text"
                placeholder="Exercise name"
                {...register("name")}
                className="border border-gray-900 rounded-xl px-3 py-2" />

            <input
                {...register("muscleGroup")}
                placeholder="Muscle group"
                className="border border-gray-900 rounded-xl px-3 py-2" />

            <input placeholder="Equipment"
                {...register("equipment")}
                className="border border-gray-900 rounded-xl px-3 py-2" />

            <button className="bg-teal-900 text-white hover:bg-teal-950 rounded-xl px-3 py-2 max-w-45">Add Excersise</button>
        </form>
    )
}