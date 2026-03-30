import { Card, CardContent } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const WorkoutCompletedPage = () => {
    const location = useLocation();
    const state = location.state || {};


    return (
        <>
            <pre>{JSON.stringify(state, null, 2)}</pre>
            <Link to={`/workout/${state.workout_id}`}>Go to workout list</Link>
            <div className="text-5xl font-bold">
                Exercise Complete

                <Card>
                    <CardContent>

                    </CardContent>
                </Card>
            </div>
        </>

    );
};