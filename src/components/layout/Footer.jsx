import { ChartColumnIncreasing, ChartNoAxesColumn, CircleUser, Dumbbell, House, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="max-w-screen-md mx-auto fixed bottom-0 left-0 right-0 w-full font-semibold">
            <nav className="flex justify-around py-3 bg-stone-900 text-emerald-500">
                <Link to="/" className="hover:text-emerald-600 justify-items-center"><House />HOME</Link>
                <Link to="/workouts" className="hover:text-emerald-600 justify-items-center"><ChartColumnIncreasing/>WORKOUT</Link>
                <Link to="/exercises" className="hover:text-emerald-600 justify-items-center"><Dumbbell/>EXERCISE</Link>
                <Link to="/profile" className="hover:text-emerald-600 justify-items-center"><CircleUser/>PROFILE</Link>
            </nav>
        </footer>
    )
}