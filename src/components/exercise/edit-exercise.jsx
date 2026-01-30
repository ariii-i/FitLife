import { SquarePen } from "lucide-react"
import { useExerciseStore } from "../../store/excersiseStore"
import { Button } from "../ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"

export function EditExerciseBox({exerciseId, currentName}) {
    const { exercises, editExercises } = useExerciseStore()

    const [open, setOpen]=useState(false);
    const [name, setName]=useState(currentName)
    console.log(name);

    const onSave= async (data) =>{
        await editExercises(exerciseId, {name})
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="ghost"
                size="icon"
                onClick={()=>setOpen(true)}>
                <SquarePen className="w-4 h-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle className="font-medium text-sm">Edit Exercise</DialogTitle>

                    <div>
                        <label className="flex flex-col">
                            Exercise Name
                            <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className="border shadow rounded-md px-3 py-2"/>
                        </label>

                    </div>

                    <Button >Save</Button>
                    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}