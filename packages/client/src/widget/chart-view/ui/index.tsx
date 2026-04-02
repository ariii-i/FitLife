import { Activity } from "lucide-react"
import { Link } from "react-router-dom"

export const DisplayChart = () => {
    return (
        <div className="flex justify-end">
            <Link
                to={`/workout-history-chart/${new Date().toISOString().split("T")[0]}`}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
                <Activity className="w-4 h-4" />
                View Workout Charts
            </Link>
        </div>
    )
}