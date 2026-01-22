import { ChartColumnIncreasing, CircleUser, Dumbbell, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar() {
    return (
        <div className="fixed bottom-0 left-0 right-0">
            
            <nav className="flex justify-around py-3 bg-teal-900 text-white">
                <Link to="/" className="hover:text-teal-300"><ChartColumnIncreasing/></Link>
                <Link to="/workouts" className="hover:text-teal-300"><ListChecks/></Link>
                <Link to="/exercises" className="hover:text-teal-300"><Dumbbell/></Link>
                <Link to="/progress" className="hover:text-teal-300"><CircleUser/></Link>
            </nav>
        </div>
    )
}