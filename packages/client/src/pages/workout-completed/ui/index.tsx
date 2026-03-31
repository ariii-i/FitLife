import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const WorkoutCompletedPage = () => {
    const location = useLocation();
    const state = location.state || {};


    return (
        <>
            <div className="text-5xl font-semibold flex flex-col gap-8">
                
                <div className="w-full flex justify-center">
                    <div className="bg-gray-800 rounded-md p-5 flex justify-center border border-gray-700 ">
                        <CircleCheckBig size="40" />
                    </div>
                </div>

                <p className="text-center">Exercise Completed!</p>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-center bg-gray-800 border border-gray-700 text-white px-4 py-5 rounded-md w-1/2 ">
                        <p>{state.duration_minutes}</p>
                        <p className="text-lg justify-center text-gray-400">Time Elapsed</p>
                    </div>

                    <div className="flex flex-col text-center bg-gray-800 border border-gray-700 text-white px-4 py-5 rounded-md w-1/2">
                        <p>{state.sets}</p>
                        <p className="text-lg justify-center text-gray-400">Sets</p>
                    </div>
                </div>

                <Link to="/" className="text-center">
                    <Button type="button" variant="ghost" className="bg-emerald-800 hover:bg-emerald-700 hover:text-white">Back to Dashboard</Button>
                </Link>

            </div>
        </>

    );
};