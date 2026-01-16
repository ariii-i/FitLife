import { Link } from "react-router-dom";

export function Sidebar() {
    return (
        <aside className="w-60  bg-teal-900 min-h-screen text-white p-4">
            <h2 className="text-xl font-bold mb-6">FITLIFE</h2>

            <nav className="flex flex-col gap-3">
                <Link to="/" className="hover:text-teal-300">Dashboard</Link>
                <Link to="/workouts" className="hover:text-teal-300">Workouts</Link>
                <Link to="/exercises" className="hover:text-teal-300">Exersise</Link>
                <Link to="/progress" className="hover:text-teal-300">Progress</Link>
            </nav>
        </aside>
    )
}