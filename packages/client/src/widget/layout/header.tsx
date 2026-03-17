import { GiStrongMan } from "react-icons/gi";

export const Header = () => {
    return (
        <div className="fixed block text-gray-50 bg-stone-950 top-0 right-0 left-0 max-w-screen-md mx-auto">
            <div className="flex bg-stone-950 text-emerald-600 font-bold px-2 pt-2 items-center gap-3 text-xl">
                <GiStrongMan size={60} /> FitTrack-Life
            </div>
        </div>
    )
}