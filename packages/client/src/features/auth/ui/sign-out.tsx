import { toast } from "sonner";
import { useUserStore } from "@/entities/user/modal/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SignOut = () => {
  const navigate=useNavigate()
  const { signOutUser } = useUserStore();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
      console.log("Signed out successfully");
      toast.success("Signed out");
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out");
    }
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>
}