import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const DashboardButton = () => {
    return (
        <div className="py-2 flex justify-end text-black">
            <Link to="/">
                <Button type="button" variant="outline">
                    Back to Dashboard
                </Button>
            </Link>
        </div>
    )
}