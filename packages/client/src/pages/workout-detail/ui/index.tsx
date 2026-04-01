import { Card } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { ReusableCardContent } from "@/widget/layout/card-content";
import { DashboardButton } from "@/widget/layout/dashboard-button";
import { useCallback, useEffect, useState } from "react";
import { Case, Default, Switch, When } from "react-if";
import { Link, useParams } from "react-router-dom";

const Component = () => {
    const { workoutId } = useParams<{ workoutId: string }>();
    const { fetchWorkoutDetail } = useWorkoutStore();

    const [detail, setDetail] = useState<any>(null);

    const init = useCallback(async () => {
        const res = await fetchWorkoutDetail(Number(workoutId));
        setDetail(res);
    }, [workoutId, fetchWorkoutDetail]);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <div className="font-semibold text-xl p-2 space-y-2">
            <p className="text-3xl">{detail?.name}</p>

            <When condition={!detail?.exercises || detail.exercises.length === 0}>
                <ReusableCardContent button={<WorkoutButton/>} message="No exercises yet." />
            </When>

            {detail?.exercises?.map((exercise: any) => {
                return (
                    <Link
                        key={exercise.id}
                        to={`/workout/${workoutId}/session/${exercise.id}`}
                    >
                        <Card className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-3 hover:bg-stone-600 transition-colors">

                            <div className="flex justify-between items-center">
                                <span className="text-stone-100 font-semibold text-lg">{exercise?.name}</span>

                                <span className="text-stone-300 text-sm">
                                    {exercise.sets} sets × {exercise.reps} reps
                                </span>
                            </div>
                        </Card>
                    </Link>
                );
            })}

            <DashboardButton />
        </div>
    );
};

export const WorkoutDetail = () => {
    const { workoutId } = useParams<{ workoutId: string }>();

    return (
        <Switch>
            <Case condition={!workoutId}>
                <ReusableCardContent button={<WorkoutButton/>} message="No exercises yet." />
            </Case>
            <Default>
                <Component />
            </Default>
        </Switch>
    );
};
