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
import { toast } from "sonner";
import { When } from "react-if";
import { WorkoutForm } from "../../make-workout-request/ui/form";

export const WorkoutActionMenu = ({
  selectedWorkout,
}: {
  selectedWorkout: any;
}) => {
  const { deleteWorkout } = useWorkoutStore();
  const [open, setOpen] = useState<boolean>(false);

  const handleEdit = async () => {
    setOpen(true);
  };

  const handleDelete = () => {
    toast.warning("Are you sure you want to delete this workout?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteWorkout(selectedWorkout.id);
            toast.success("Workout Deleted!");
          } catch (error) {
            toast.error("Unable to delete.");
          }
        },
      },
    });
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
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <When condition={open}>
        <WorkoutForm
          open={open}
          setOpen={setOpen}
          selectedWorkout={selectedWorkout}
        />
      </When>
      {/* {editing && <EditWorkout open={open} setOpen={setOpen} />} */}
    </div>
  );
};
