import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkoutSessionStore } from "@/entities/workout-session/modal/store";
import { DashboardButton } from "@/widget/layout/dashboard-button";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { StopWatch } from "./stopwatch";
import { auth } from "@/shared/lib/firebase";

export const SessionPage = () => {
  const { workoutId, exerciseId } = useParams<{
    workoutId: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [startTimeStamp, setStartTimeStamp] = useState<string | null>(null);
  const [endTimeStamp, setEndTimeStamp] = useState<string | null>(null);
  const [sets, setSets] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const { createSession } = useWorkoutSessionStore();

  const handleStart = () => {
    if (!workoutId) return toast.error("Workout not selected");

    const start = new Date().toISOString();
    setStartTimeStamp(start);
    setIsActive(true);
  };

  const handleStop = () => {
    if (!startTimeStamp) return toast.error("Session has not started yet");

    const endTime = new Date().toISOString();
    setEndTimeStamp(endTime);
    setIsActive(false);
    setOpenDrawer(true);
  };

  const handleAdd = async () => {
    if (!startTimeStamp || !endTimeStamp)
      return toast.error("Session timestamps missing");

    try {
      const start = new Date(startTimeStamp);
      const end = new Date(endTimeStamp);
      const durationMinutes = Math.ceil(
        (end.getTime() - start.getTime()) / 60000,
      );

      const payload = {
        user_id: auth.currentUser?.uid || "", // TODO: replace with actual user id
        workout_id: Number(workoutId),
        duration_minutes: durationMinutes,
        performed_at: startTimeStamp,
        exercise_id: Number(exerciseId), // TODO: allow user to select exercise
        sets,
        reps,
      };
      await createSession(payload);

      toast.success("Session saved!");
      navigate(`/workout-completed`, { state: payload });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save session");
    }
  };

  return (
    <div className="space-y-4">
      <StopWatch isActive={isActive} />

      {!isActive ? (
        <div className="flex justify-center">
          <Button
            onClick={handleStart}
            className="rounded-xl px-6 py-3 text-lg font-medium"
          >
            Start
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={handleStop}
            variant="destructive"
            className="rounded-xl px-6 py-3 text-lg font-medium text-stone-100"
          >
            Stop
          </Button>
        </div>
      )}

      {openDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpenDrawer(false)}
          />
          <div className="ml-auto h-full w-full max-w-md bg-gray-900 border-gray-900 rounded-md p-4 flex flex-col gap-4 z-10">
            <h2 className="text-xl font-bold text-stone-100">
              Session Complete
            </h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-stone-500">Sets</label>
              <Input
                type="number"
                min={0}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="bg-stone-600 text-stone-100 px-3 py-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-stone-500">Reps</label>
              <Input
                type="number"
                min={0}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="bg-stone-600 text-stone-100 px-3 py-2 rounded"
              />
            </div>

            <div className="flex flex-col flex-1" />

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-stone-100 w-full"
              >
                Add
              </Button>

              <Button
                onClick={() => setOpenDrawer(false)}
                className="bg-gray-600 border-0 text-white hover:bg-gray-500 hover:text-white w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <DashboardButton />
    </div>
  );
};
