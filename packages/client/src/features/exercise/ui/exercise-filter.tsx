import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MUSCLE_GROUP_OPTIONS, MuscleGroup } from "@/entities/exercise/config";
import { useExerciseFilterStore } from "@/entities/exercise/modal/use-exercise-filter-store";

export const ExerciseFilter = () => {
    const { name, muscleGroup, setName, setMuscleGroup, clearFilters } =
        useExerciseFilterStore();

    return (
        <div className="flex gap-3 items-center">
            <Input
                placeholder="Search by name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-48 border-gray-700 h-8 bg-gray-800 rounded-md"
            />

            <Select
                value={muscleGroup ?? "all"}
                onValueChange={(value) =>
                    setMuscleGroup(value === "all" ? null : (value as MuscleGroup))
                }
            >
                <SelectTrigger className="w-40 border border-gray-700 h-8 bg-gray-800 rounded-md">
                    <SelectValue placeholder="Muscle Group" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {MUSCLE_GROUP_OPTIONS.map((group) => (
                        <SelectItem key={group} value={group}>
                            {group.charAt(0).toUpperCase() + group.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" onClick={clearFilters} className="bg-emerald-800 hover:bg-emerald-700 hover:text-white">
                Clear
            </Button>
        </div>
    );
};
