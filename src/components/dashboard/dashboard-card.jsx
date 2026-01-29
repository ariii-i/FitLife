import { CalendarClock, Flame, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription } from "../ui/card";

export function DashboardCard() {
    return (
        <div className="space-y-2">
            <CardDescription>
                Welcome back! Heres your fitness overview
            </CardDescription>

            <div className="flex gap-2 justify-center">
                <Card>
                    <CardContent className="font-medium text-sm">Current Streaks
                        <Flame className="text-red-500" />
                        x days in a row
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="text-sm font-medium">
                        This Week
                        <Target className="text-blue-500" />

                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="text-sm font-medium">
                        Total Workouts
                        <Trophy className="text-green-500" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="text-sm font-medium">
                        Upcoming Workout
                        <CalendarClock className="text-purple-500"/>
                    </CardContent>
                </Card>

            </div>

            <Card>
                <CardContent className="text-sm font-medium">
                    Weekly Activity
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <span className="font-semibold">Recent workouts</span>
                    
                    <CardDescription>Your latest session</CardDescription>


                </CardContent>
            </Card>
        </div>
    )
}