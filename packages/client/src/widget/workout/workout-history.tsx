import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const WorkoutHistory: React.FC = () => {
    const { workoutLogId } = useParams<{ workoutLogId: string }>();
    const { workoutLogs, fetchWorkoutLogs } = useWorkoutLogStore();
    const [log, setLog] = useState(null);

    useEffect(() => {
        if (workoutLogs.length === 0) {
            fetchWorkoutLogs();
        } else {
            const found = workoutLogs.find((l) => l._id === workoutLogId);
            setLog(found);
        }
    }, [workoutLogs, workoutLogId, fetchWorkoutLogs]);

    if (!log) return;

    return (
        <div className="space-y-4 p-4">
            <h2 className="text-xl font-bold">
                Workout History: {new Date(log.date).toDateString()}
            </h2>
            <p className="font-medium">{log.workout.name}</p>

            <div className="space-y-3">
                {log.sessions.map((s) => (
                    <Card key={s._id} className="p-4 bg-stone-800 text-stone-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{s.exercise?.name}</p>
                                <p className="text-sm text-stone-400">
                                    {s.completed && "Completed"}
                                </p>
                            </div>

                            <div className="text-right text-sm text-stone-300">
                                <p>Sets: {s.sets ?? "-"}</p>
                                <p>Reps: {s.reps ?? "-"}</p>
                                <p>Weight: {s.weight ?? "-"}</p>
                                <p>
                                    Duration:{" "}
                                    {s.startTime && s.endTime
                                        ? getDuration(s.startTime, s.endTime)
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Link to="/">
                    <Button type="button" variant="link">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
};

function getDuration(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    let diff = Math.floor((endTime - startTime) / 1000);

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}