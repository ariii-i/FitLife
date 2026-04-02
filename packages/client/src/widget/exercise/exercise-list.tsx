import { AddExercises } from "@/features/exercise/make-exercise-request/ui/create-exercises-button";
import { Case, Else, If, Switch, Then } from "react-if";
import { useExerciseStore } from "../../entities/exercise/modal/store";
import { ExerciseActionMenu } from "../../features/exercise/action-menu/ui";
import { ReusableCardContent } from "../layout/card-content";
import { ExerciseMetric } from "./ui/exercise-metric";
import { IMAGE_PATH_BASE } from "@/shared/lib/orpc";
import { Link } from "react-router-dom";

export const Component = () => {
    const { exercises } = useExerciseStore();

    return (
        <div className="flex flex-col gap-4">
            <ExerciseMetric />
            <div className="flex flex-col gap-3 text-lg">
                {exercises.map((exercise) => {
                    const image = `${IMAGE_PATH_BASE}${exercise.image_path}`
                    return (
                        <div
                            key={exercise.id}
                            className="bg-gray-800 border border-gray-700 px-5 py-3 rounded-sm text-gray-50 flex items-center justify-between">
                            <Link to={`/exercise/${exercise.id}`} className="flex flex-1 gap-4 justify-start items-center font-medium">
                                <If condition={exercise.image_path}>
                                    <Then>
                                        <img src={image} alt={exercise.name} className="w-20 h-20 object-cover py-2 " />
                                        <p>{exercise.name}</p>
                                    </Then>
                                    <Else>
                                        <img src="https://i.pinimg.com/474x/3f/3d/b8/3f3db8e4c64d1ee9e69c7fec91c45556.jpg" alt={exercise.name} className="w-20 h-20 object-cover py-2" />
                                        <p>{exercise.name} </p>
                                    </Else>
                                </If>
                            </Link>

                            <ExerciseActionMenu selectedRow={exercise} />
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export const ExerciseList = () => {
    const { exercises } = useExerciseStore();

    return (
        <Switch>
            <Case condition={!exercises || exercises.length === 0}>
                <ReusableCardContent button={<AddExercises />} message="No exercise yet. Create a new one?" />
            </Case>
            <Case condition={exercises && exercises.length > 0}>
                <Component />
            </Case>
        </Switch>
    );
};
