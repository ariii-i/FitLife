import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { useParams } from "react-router-dom";
import { SessionForm } from "./form";

export const WorkoutLogDrawer = ({ open, setOpen, startTimeStamp, }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    startTimeStamp: string | null;
}) => {
    const { exerciseId } = useParams();
    const { workout } = useWorkoutStore();

    const selected = workout?.exercises?.find(
        (ex) => ex.exercise._id === String(exerciseId)
    );
    
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-2 h-full flex flex-col">
                <DrawerTitle>Planned Exercise</DrawerTitle>

                <div className="flex gap-3">
                    <Card className="bg-stone-700 text-stone-100 p-4 flex-[2] text-center">
                        {selected?.exercise.name}
                    </Card>

                    <Card className="bg-stone-800 text-stone-100 p-4 flex-1 text-center">
                        <div className="text-xs text-stone-400">SETS</div>
                        <div className="text-lg font-bold">{selected?.plannedSets}</div>
                    </Card>

                    <Card className="bg-stone-800 text-stone-100 p-4 flex-1 text-center">
                        <div className="text-xs text-stone-400">REPS</div>
                        <div className="text-lg font-bold">{selected?.plannedReps}</div>
                    </Card>
                </div>

                <DrawerTitle>Actual Exercise</DrawerTitle>

                <SessionForm startTimeStamp={startTimeStamp} />
            </DrawerContent>
        </Drawer>
    )
}