import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ExerciseForm } from "./form";
import { When } from "react-if";

export const AddExercises = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
      </Button>
      <When condition={open}>
        <ExerciseForm open={open} setOpen={setOpen} />
      </When>
    </>
  );
};
