import { useEffect, useState } from "react"
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import { useParams } from "react-router-dom";

export const StopWatch = ({ isActive }) => {
    const { workoutId, exerciseId } = useParams()
    
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime(prev => prev + 1000);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const hours = Math.floor(time / 3600000).toString().padStart(2, "0");
    const minutes = Math.floor((time / 60000) % 60).toString().padStart(2, "0");
    const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, "0");

    return (
        <Card className="text-5xl font-bold bg-stone-950 text-stone-100 px-8 py-4 rounded-2xl shadow-xl border border-stone-600 font-mono">
            {hours}:{minutes}:{seconds}
        </Card>
    );
};