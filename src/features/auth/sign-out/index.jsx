import { toast } from "sonner";
import { Button } from "../../../shared/ui/button";
import { useUserStore } from "../../../entities/user/store";

export const SignOut = () => {
  const { signOutUser } = useUserStore();

  const handleSignOut = async () => {
    try {
      await signOutUser(); // ✅ await the async function
      console.log("Signed out successfully");
      toast.success("Signed out");
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out");
    }
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>; // ✅ call function
};