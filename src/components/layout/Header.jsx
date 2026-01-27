import { Dumbbell } from "lucide-react";

export function Header(){
    return(
        <header className="h-14 flex items-center">
            <Dumbbell/>
            <h1 className="font-bold text-2xl px-2">FITLIFE</h1>
        </header>
    )
}