import { Pencil } from "lucide-react"
import { useUserStore } from "../../entities/user/store"
import { Button } from "../../shared/ui/button"
import { useState } from "react"

export const EditProfile=()=>{
    const [open, setOpen]=useState(false)
    const {user}=useUserStore()
    return(
        <div>
            <Button><Pencil/></Button>

            
        </div>
    )
}