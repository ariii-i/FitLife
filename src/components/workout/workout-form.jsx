import { Controller, useForm } from "react-hook-form";
import { useExerciseStore } from "../../store/excersiseStore";
import { useWorkoutStore } from "../../store/workout-Store";

export function AddWorkoutForm() {
    const { exercises } = useExerciseStore();
    const { addWorkout } = useWorkoutStore();
    const { register, handleSubmit, reset, control } = useForm()

    const onSubmit = (data) => {
        data.sets = Number(data.sets);
        data.reps = Number(data.reps);

        addWorkout(data);
        console.log(data);
        reset()
    }

    return (
        <form className="py-3 px-3 flex flex-col gap-5 shadow" onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Exercise Name"
                className="border border-gray-900 rounded-xl px-3 py-2" />

            <input
                placeholder="Day"
                className="border border-gray-900 rounded-xl px-3 py-2"
                {...register("day", { required: true })}
                type="text" />

            <input
                placeholder="Number of sets"
                className="border border-gray-900 rounded-xl px-3 py-2"
                {...register("sets", { required: true })}
                type="number" />

            <input
                placeholder="Number of reps"
                className="border border-gray-900 rounded-xl px-3 py-2"
                type="number"
                {...register("reps", { required: true })} />

            <div className="space-y-2 rounded-xl ">
                <p className="font-semibold">Excersises</p>

                <div className="flex flex-col gap-2">
                    {exercises.map((ex) => (
                        <label key={ex._id} className="flex-col border rounded-xl px-3 py-2">
                            <input
                                type="checkbox"
                                value={ex._id}
                                {...register("exercises")}
                                 />
                            <span className="px-2">
                                {ex.name} ({ex.muscleGroup})
                            </span>
                        </label>
                    ))}
                </div>

            </div>

            
            {/* <pre>{JSON.stringify(exercises, null, 2)}</pre> */}

            <button className=" w-50 bg-teal-900 hover:bg-teal:950 px-3 py-2 rounded-xl text-white">Add Workout</button>
        </form>
    )
}