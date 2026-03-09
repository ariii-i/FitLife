import { Pencil } from "lucide-react"
import { useUserStore } from "../../entities/user/store"
import { Button } from "../../shared/ui/button"
import { useState } from "react"
import { Drawer, DrawerContent, DrawerTitle } from "../../shared/ui/drawer"
import { useForm } from "react-hook-form"
import { Input } from "../../shared/ui/input"

export const EditProfile = () => {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit } = useForm();
    const { user } = useUserStore();
    const onSubmit = (data) => {
        console.log(data)
        return (
            55
        )
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}><Pencil /></Button>
            <Drawer direction="right" open={open} onOpenChange={setOpen}>
                <DrawerContent className="p-2 h-full flex flex-col">
                    <DrawerTitle>Profile</DrawerTitle>

                    <form className="space-y-2 flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
                       <Input {...register("Weight")} placeholder="Enter your weight" />
                       <Input {...register("Height")} placeholder="Enter your height" />

                        <div className="flex-1" />

                        <div className="flex gap-2 w-full">
                            <Button type="submit" className="w-full">Save</Button>
                            <Button type="button" className="w-full" onClick={() => setOpen(false)}>Close</Button>
                        </div>
                    </form>

                </DrawerContent>

            </Drawer>

        </div>
    )
}