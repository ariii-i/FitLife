import { Card, CardContent } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { IMAGE_PATH_BASE } from "@/shared/lib/orpc";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

export const ExerciseDetail = () => {
    const { workoutId, workoutName } = useParams<{ workoutId: string, workoutName: string }>();
    const { fetchWorkoutDetail } = useWorkoutStore();

    const [workoutDetail, setWorkoutDetail] = useState<any>(null);

    const init = useCallback(async () => {
        if (!workoutId) return;
        const id = Number(workoutId);

        try {
            const data = await fetchWorkoutDetail(id);
            setWorkoutDetail(data);
        } catch (err) {
            console.error("Failed to fetch workout detail:", err);
        }
    }, [workoutId, fetchWorkoutDetail]);


    useEffect(() => {
        init();
    }, [init]);

    if (!workoutDetail) {
        return <p>Loading workout details...</p>;
    }

    return (
        <div className="p-4" >
            <h2 className="text-2xl font-semibold mb-4">{workoutName}</h2>

            <h3 className="text-xl font-semibold mb-4">Exercises:</h3>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {workoutDetail.exercises?.map((ex: any) => {
                    const image = `${IMAGE_PATH_BASE}${ex.image_path}`

                    return (
                        <Card
                            key={ex.id}
                            className="bg-gray-800 border border-gray-700 text-white rounded-lg flex flex-col overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                                <div className="text-lg font-bold truncate">{ex.name}</div>
                                <div className="px-2 py-1 rounded-lg bg-emerald-800 text-white text-xs ">
                                    {ex.muscle_group}
                                </div>
                            </div>

                            {ex.image_path ? (
                                <img src={image} alt={ex.name} className="w-full h-40 object-cover py-2" />
                            ) : (
                                <img src="https://i.pinimg.com/474x/3f/3d/b8/3f3db8e4c64d1ee9e69c7fec91c45556.jpg" alt={ex.name} className="w-full h-40 object-cover py-2" />
                            )}

                            <CardContent className="px-4 py-2 flex flex-col gap-1">
                                {ex.description && <p className="text-md font-semibold">{ex.description}</p>}
                                <p className="text-sm text-gray-300">
                                    {ex.sets} sets × {ex.reps} reps
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
};