import { useExerciseStore } from "../../store/excersiseStore"
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";

export function EditExerciseBox() {
    const {exercises}=useExerciseStore();

    const [open, setOpen]= useState();

    return(
        <div>
            <Button onClick={Set}></Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <div>
                        Hi
                    </div>
                </DialogContent>
                <Button type="button" onClick={() => setOpen(false)}>Save</Button>
            </Dialog>
        </div>
    )
}