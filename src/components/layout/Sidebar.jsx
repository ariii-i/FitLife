import { ChartColumnIncreasing, CircleUser, Dumbbell, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar() {
    return (
        <div className="fixed bottom-0 left-0 right-0">
            
            <nav className="flex justify-around py-3 bg-stone-900 text-white">
                <Link to="/" className="hover:text-stone-600"><ChartColumnIncreasing/></Link>
                <Link to="/workouts" className="hover:text-stone-600"><ListChecks/></Link>
                <Link to="/exercises" className="hover:text-stone-600"><Dumbbell/></Link>
                <Link to="/progress" className="hover:text-stone-600"><CircleUser/></Link>
            </nav>
        </div>
    )
}