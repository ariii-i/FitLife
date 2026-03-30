import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export const WorkoutCompletedWidget = ({open, setOpen}:{
    open: boolean,
    setOpen: any
}) => {
    // const { workoutLogs } = useWorkoutLogStore()
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogHeader>
                    Exercise Complete
                </DialogHeader>

                <DialogContent>
                    This is modal
                </DialogContent>
            </Dialog>
        </div>
    )
}