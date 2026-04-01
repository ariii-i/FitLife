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
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useExerciseFilterStore } from "@/entities/exercise/modal/use-exercise-filter-store";
import { useUserStore } from "@/entities/user/modal/store";
import React from "react";

export const ExerciseFilter = () => {
  const { filters, setFilters, clearFilters } = useExerciseFilterStore();
  const { user } = useUserStore();
  const { fetchExercises } = useExerciseStore();

  React.useEffect(() => {
    return () => {
      clearFilters();
    };
  }, []);
  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search by name..."
        value={filters.name}
        onChange={async (e) => {
          const new_filters = setFilters({ ...filters, name: e.target.value });
          await fetchExercises({ ...new_filters, user_id: user?.uid || "" });
        }}
        className="w-48 border-gray-700 h-8 bg-gray-800 rounded-md"
      />

      <Select
        value={filters?.muscle_group ?? "all"}
        onValueChange={async (value) => {
          const new_filters = setFilters({
            ...filters,
            muscle_group: value === "all" ? undefined : (value as MuscleGroup),
          });
          await fetchExercises({ ...new_filters, user_id: user?.uid || "" });
        }}
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

      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          clearFilters();
          await fetchExercises({ user_id: user?.uid || "" });
        }}
        className="bg-emerald-800 hover:bg-emerald-700 hover:text-white"
      >
        Clear
      </Button>
    </div>
  );
};
