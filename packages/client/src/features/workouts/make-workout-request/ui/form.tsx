import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

export const WorkoutForm = ({ open, setOpen }: {
    open: boolean
    setOpen: ((open: boolean) => void)
}) => {
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-w-screen-md p-2 ">
                <DrawerTitle>Workout form</DrawerTitle>

                <form className="space-y-2 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
                    {/* <div>
                        <label>Workout Name</label>
                        <Input {...register("name")} type="text" />
                    </div>

                    <ExerciseList control={control} register={register} setValue={setValue} /> */}

                    <div className="flex gap-2">
                        <Button className="w-full">Add Workout</Button>
                        <Button className="w-full" onClick={() => {
                            setOpen(false)
                            reset()
                        }} type="button">
                            Close
                        </Button>
                    </div>
                </form>


            </DrawerContent>
        </Drawer>
    )
}