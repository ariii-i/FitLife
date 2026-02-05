import { Bell, CircleUser, Dumbbell } from "lucide-react";

export function Header() {
    return (
        <header className="max-w-screen-md mx-auto h-14 flex items-center justify-between bg-stone-900 text-emerald-500 p-2">
            <div className="flex gap-2">
                <Dumbbell />
                <h1 className="font-bold text-xl px-2 text-white">FitTrack Lite</h1>
            </div>

            <div className="flex gap-3">
                <Bell />
                <CircleUser />
            </div>
        </header>
    )
}