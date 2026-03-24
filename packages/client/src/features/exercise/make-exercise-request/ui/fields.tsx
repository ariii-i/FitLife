import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { When } from "react-if";
import { MUSCLE_GROUP_OPTIONS } from "../../../../entities/exercise/config";

export const NameField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Name</label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            id="name"
            placeholder="e.g. Bench Press"
            value={field.value || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          />
        )}
      />
      <When condition={!!errors.name}>
        <div className="text-destructive text-sm">
          {errors?.name?.message + ""}
        </div>
      </When>
    </div>
  );
};

export const DesciptionField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Description</label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            id="description"
            placeholder="Give some description about the exercise"
            value={field.value || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          />
        )}
      />
      <When condition={!!errors.name}>
        <div className="text-destructive text-sm">
          {errors?.name?.message + ""}
        </div>
      </When>
    </div>
  );
};

export const MuscleGroupField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Muscle Group</label>
      <Controller
        control={control}
        name="muscle_group"
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            modal={false}
          >
            <SelectTrigger id="muscle_group">
              <SelectValue placeholder="Select muscle group" />
            </SelectTrigger>
            <SelectContent
              portalProps={{ container: document.body }}
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              {MUSCLE_GROUP_OPTIONS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <When condition={!!errors.muscle_group}>
        <div className="text-destructive text-sm">
          {errors?.muscle_group?.message + ""}
        </div>
      </When>
    </div>
  );
};
