import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { When } from "react-if";
import { WorkoutForm } from "../../make-workout-request/ui/form";

export const WorkoutActionMenu = ({
  selectedWorkout,
}: {
  selectedWorkout: any;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleEdit = async () => {
    setOpen(true);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          {/* <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <When condition={open}>
        <WorkoutForm open={open} setOpen={setOpen} selectedWorkout={selectedWorkout} />
      </When>
    </div>
  );
};
