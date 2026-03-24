import { useExerciseFilterStore } from "@/entities/exercise/modal/use-exercise-filter-store";
import { MUSCLE_GROUP_OPTIONS, MuscleGroup } from "@/entities/exercise/config";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const ExerciseFilter: React.FC = () => {
  const { name, muscleGroup, setName, setMuscleGroup, clearFilters } =
    useExerciseFilterStore();

  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search by name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-48"
      />
      <Select
        value={muscleGroup ?? "all"}
        onValueChange={(value) =>
          setMuscleGroup(value === "all" ? null : (value as MuscleGroup))
        }
      >
        <SelectTrigger className="w-40">
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
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear
      </Button>
    </div>
  );
};
