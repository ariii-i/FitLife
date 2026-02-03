import { ChartColumnIncreasing, ChartNoAxesColumn, CircleUser, Dumbbell, House, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="max-w-screen-md mx-auto fixed bottom-0 left-0 right-0 w-full">
            <nav className="flex justify-around py-3 bg-stone-900 text-emerald-900">
                <Link to="/" className="hover:text-emerald-600"><House/>HOME</Link>
                <Link to="/workouts" className="hover:text-emrald-600"><ChartColumnIncreasing className="fill-green-500"/></Link>
                <Link to="/exercises" className="hover:text-stone-600"><Dumbbell/></Link>
                <Link to="/progress" className="hover:text-stone-600"><CircleUser/></Link>
            </nav>
        </footer>
    )
}