import { useEffect } from "react";
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import z from "zod";
import { DesciptionField, MuscleGroupField, NameField } from "./fields";
import { useFormContext } from "react-hook-form";

export const ExerciseFieldSet = ({
  selectedExercise,
}: {
  selectedExercise?: z.infer<typeof Schema_Exercise>;
}) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (selectedExercise) {
      setValue("name", selectedExercise.name);
      setValue("description", selectedExercise.description);
      setValue("muscle_group", selectedExercise.muscle_group);
      setValue("id", selectedExercise.id);
      setValue("user_id", selectedExercise.user_id);
    }
  }, [selectedExercise, setValue]);

  return (
    <div className="space-y-3">
      <NameField />
      <DesciptionField />
      <MuscleGroupField />
    </div>
  );
};
