import { ConnectForm } from "@/custom-components/ui/connect-form";
import { FormProvider } from "@/custom-components/ui/form-provider";
import { SubmitHandler } from "react-hook-form";
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../../../../components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../../../components/ui/drawer";
import { useExerciseStore } from "../../../../entities/exercise/modal/store";
import { ExerciseFormSchema } from "../../../../entities/exercise/api";
import { ExerciseFieldSet } from "./field-set";

type FormValue = z.infer<typeof ExerciseFormSchema>;

type ExerciseFormProp = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedExercise?: z.infer<typeof Schema_Exercise>;
};

export const ExerciseForm = ({
  open,
  setOpen,
  selectedExercise,
}: ExerciseFormProp) => {
  const { createExercise, editExercise, fetchExercises } = useExerciseStore();

  const handleSubmitExercise: SubmitHandler<FormValue> = async (data) => {
    if (!data.name?.trim()) {
      toast.error("Please enter exercise name.");
      return;
    }

    try {
      //   setIsSubmitting(true);

      if (selectedExercise) {
        await editExercise(data);
        toast.success("Exercise updated!");
      } else {
        await createExercise(data);
        toast.success("Exercise added!");
      }

      await fetchExercises();
      //   reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save exercise.");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="p-4">
        <FormProvider
          className="flex flex-col flex-1"
          onSubmit={handleSubmitExercise}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>
              {selectedExercise?.id ? "Edit Exercise" : "New Exercise"}
            </DrawerTitle>
            <DrawerDescription>
              {selectedExercise ? "Update exercise" : "Create a new exercise"}
            </DrawerDescription>
          </DrawerHeader>

          <ExerciseFieldSet selectedExercise={selectedExercise} />

          <DrawerFooter>
            <ConnectForm<FormData>>
              {({ formState }) => {
                return (
                  <Button type="submit" form="exam-form">
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
