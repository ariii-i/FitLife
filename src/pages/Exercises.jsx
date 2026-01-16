import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { useExersiseStore } from "../store/excersiseStore";

export function Exercises() {
    const exercise = useExersiseStore((state) => state.exercise);
    const addExercises = useExersiseStore((state) => state.addExercises);
    const deleteExercise = useExersiseStore((state) => state.deleteExercise)

    const [name, setName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [equipment, setEquipment] = useState("");
    const [showForm, setShowForm] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && muscleGroup && equipment) {
            addExercises({ name, muscleGroup, equipment })
        }
        setName("");
        setMuscleGroup("");
        setEquipment("");
    }
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold">Exercise</h1>
        </Layout>
    )
}