import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { Greetings } from "@/widget/greetings/ui";
import { StreakView } from "@/widget/streak-view/ui";
import { WorkoutList } from "@/widget/workout/workout-list/ui";
import { useEffect } from "react";
import { auth } from "../../shared/lib/firebase";

export const HomePage = () => {
    const { fetchUser } = useUserStore();
    const { fetchWorkouts } = useWorkoutStore();

    const currentUser = auth.currentUser;
    useEffect(() => {
        if (currentUser) {
            fetchUser(currentUser.uid);
        }
        fetchWorkouts();
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <Greetings />
            <StreakView />
            <WorkoutList />
        </div>
    );
};
