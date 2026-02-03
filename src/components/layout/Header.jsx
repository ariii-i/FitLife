import { Bell, CircleUser, Dumbbell } from "lucide-react";

export function Header() {
    return (
        <header className="h-14 flex items-center justify-between bg-stone-900 text-white">
            <div className="flex ">
                <Dumbbell />
                <h1 className="font-bold text-xl px-2">FitTrack Lite</h1>
            </div>

            <div className="flex gap-2">
                <Bell />
                <CircleUser />
            </div>
        </header>
    )
}