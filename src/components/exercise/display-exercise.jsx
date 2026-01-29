import { useExerciseStore } from "../../store/excersiseStore"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { SquarePen } from 'lucide-react';
import { Trash2 } from 'lucide-react';

export function DisplayExercises() {

    const { exercises, editExercises, deleteExercise } = useExerciseStore()

    if (!exercises || exercises.length === 0) {
        return (
            <div className="w-full  mt-3 ">
                <Card className="flex items-center justify-center p-6">
                    <CardContent className="text-xl font-semibold">
                        No exercises added
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
            <ul className="space-y-2 mt-3">
                {exercises.map((ex) => (
                    <li key={ex._id}>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6 ">
                                    <div className="text-xl font-semibold ">{ex.name}
                                    </div>

                                    <div >
                                        <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    const newName = prompt("Edit exercise name:", ex.name)
    if (newName && newName !== ex.name) {
      editExercises(ex._id, { name: newName })
    }
  }}
>
  <SquarePen className="w-4 h-4" />
</Button>

                                        <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Delete ${ex.name}?`)){deleteExercise(ex._id)}}}>
                                            <Trash2 className="h-4 w-4 text-red-500"/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                    </li>
                ))}
            </ul>
    )
}