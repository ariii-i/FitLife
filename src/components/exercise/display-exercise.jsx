import { useExerciseStore } from "../../store/excersiseStore"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { SquarePen } from 'lucide-react';
import { Trash2 } from 'lucide-react';

export function DisplayExercises() {

    const { exercises, deleteExercise } = useExerciseStore()

    if (!exercises || exercises.length === 0) {
        return (
            <Carousel opts={{ align: "center" }} orientation="vertical" className="w-full ">
                <Card className="flex items-center justify-center p-6">
                    <CardContent className="text-xl font-semibold">
                        No exercises added
                    </CardContent>
                </Card>
            </Carousel>
        )
    }

    return (
        <Carousel opts={{ align: "center" }} orientation="vertical" className="w-full mt-3">
            <CarouselContent className="h-auto">
                {exercises.map((ex) => (
                    <CarouselItem key={ex._id} className="basis-1/3">
                        <div>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <div className="text-xl font-semibold">{ex.name}
                                    </div>

                                    <div >
                                        <Button variant="ghost" size="icon">
                                            <SquarePen className="w-4 h-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Delete ${ex.name}?`)){deleteExercise(ex._id)}}}>
                                            <Trash2 className="h-4 w-4 text-red-500"/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />

        </Carousel>
    )
}