import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { ReusableCardContent } from "@/widget/layout/card-content";
import { Dot } from "lucide-react";
import { Case, Switch } from "react-if";
import { Link } from "react-router-dom";

export const Component = () => {
    const { workouts } = useWorkoutStore();

    return (
        <div className="space-y-2 text-lg">
            <p className="text-xl font-semibold">Today's Workout</p>

            <div className="flex flex-wrap gap-4">
                {workouts.map((work) => (
                    <Card
                        key={work.id}
                        className="bg-gray-800 border border-gray-700 rounded-md p-2 text-stone-100 font-semibold flex flex-col w-full sm:w-[48%] lg:w-[30%]"
                    >
                        <CardHeader className="text-2xl font-semibold py-2">
                            {work.name} 
                        </CardHeader> 

                        <CardContent className="h-36">
                            <ul className="grid grid-rows-3 auto-cols-max [grid-auto-flow:column] gap-2 h-full">
                                {work.exercises?.map((ex) => (
                                    <li key={ex.id} className="flex items-center text-lg">
                                        <Dot />
                                        <span className="ml-1">{ex.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <Link to={`/session/${work.id}`} className="w-full mt-2">
                            <Button type="button" className="w-full">
                                Start Workout
                            </Button>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const WorkoutList = () => {
    const { workouts } = useWorkoutStore();

    return (
        <Switch>
            <Case condition={!workouts || workouts.length === 0}>
                <ReusableCardContent button={<WorkoutButton />} message="No workouts yets. Add" />
            </Case>
            <Case condition={workouts && workouts.length > 0}>
                <Component />
            </Case>
        </Switch>
    );
}