import { Card, CardContent } from "@/components/ui/card"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { IMAGE_PATH_BASE } from "@/shared/lib/orpc"
import { Else, If, Then } from "react-if"
import { useParams } from "react-router-dom"

export const ExerciseCard = () => {
    const { exercises } = useExerciseStore()
    const { exerciseId } = useParams<{ exerciseId: string }>();

    return (
        <div className="p-4">
            {exercises
                .filter((ex) => ex.id == Number(exerciseId))
                .map((exercise) => {
                    const image = `${IMAGE_PATH_BASE}${exercise.image_path}`

                    return (
                        <Card
                            key={exercise.id}
                            className="bg-gray-800 border border-gray-700 text-white rounded-xl overflow-hidden w-[350px] shadow-lg"
                        >
                            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                                <div className="text-lg font-bold truncate">
                                    {exercise.name}
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-emerald-800 text-xs">
                                    {exercise.muscle_group}
                                </div>
                            </div>

                            <If condition={exercise.image_path}>
                                <Then>
                                    <img
                                        src={image}
                                        alt={exercise.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </Then>
                                <Else>
                                    <img
                                        src="https://i.pinimg.com/474x/3f/3d/b8/3f3db8e4c64d1ee9e69c7fec91c45556.jpg"
                                        alt={exercise.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </Else>
                            </If>

                            <CardContent className="p-4">
                                {exercise.description && (
                                    <p className="text-sm text-gray-300">
                                        {exercise.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
        </div>
    )
}