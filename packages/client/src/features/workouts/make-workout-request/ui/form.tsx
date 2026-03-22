import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ConnectForm } from "@/custom-components/ui/connect-form";
import { FormProvider } from "@/custom-components/ui/form-provider";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import {
  Schema_Create_Workout,
  Schema_Update_Workout,
} from "server/src/orpc-server/packages/workout/domain/schema-workout";
import { toast } from "sonner";
import z from "zod";
import { WorkoutFieldSet } from "./field-set";

export type PlannedValue = {
  _key?: string;
  _id: string;
  name: string;
  sets: number;
  reps: number;
  selected: boolean;
};

export type WorkoutFormValue = z.infer<typeof Schema_Create_Workout>;

export const WorkoutForm = ({
  open,
  setOpen,
  selectedWorkout,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedWorkout?: any;
}) => {
  const { createWorkout, updateWorkout, fetchWorkouts } = useWorkoutStore();

  const onSubmit = async (data: any) => {
    if (selectedWorkout) {
      const payload: z.infer<typeof Schema_Update_Workout> = {
        id: selectedWorkout.id,
        name: data.name,
        user_id: 1,
        exercises: data.exercises.map((exercise: any) => ({
          exercise_id: exercise.exercise_id,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps),
        })),
      };
      await updateWorkout(payload);
      toast.success("Workout updated successfully");
      setOpen(false);
      await fetchWorkouts();
    } else {
      try {
        const payload: z.infer<typeof Schema_Create_Workout> = {
          name: data.name,
          user_id: 1,
          exercises: data.exercises.map((exercise: any) => ({
            exercise_id: exercise.exercise_id,
            sets: Number(exercise.sets),
            reps: Number(exercise.reps),
          })),
        };

        const { success, error } = Schema_Create_Workout.safeParse(payload);

        if (!success) {
          toast.error(JSON.stringify(error.format()));
          return;
        }

        await createWorkout(payload);
        toast.success("Workout created successfully");

        setOpen(false);
        await fetchWorkouts();
      } catch (error) {
        toast.error("Unable to create exercise.");
      }
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="p-4">
        <FormProvider className="flex flex-col flex-1" onSubmit={onSubmit}>
          <DrawerHeader className="gap-1">
            <DrawerTitle>
              {selectedWorkout?.id ? "Edit Workout" : "New Workout"}
            </DrawerTitle>
            <DrawerDescription>
              {selectedWorkout ? "Update workout" : "Create a new workout"}
            </DrawerDescription>
          </DrawerHeader>

          <WorkoutFieldSet selectedWorkout={selectedWorkout} />

          <DrawerFooter>
            <ConnectForm<FormData>>
              {({ formState }) => {
                return (
                  <Button type="submit">
                    {formState.isSubmitting ? "Saving..." : "Save"}
                  </Button>
                );
              }}
            </ConnectForm>
            <DrawerClose asChild>
              <Button variant="outline">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};
