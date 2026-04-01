import { Button } from "@/components/ui/button";
import { useUserStore } from "@/entities/user/modal/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SignOut = () => {
    const { signOutUser } = useUserStore();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOutUser(navigate);
            toast.success("Signed out");
        } catch (error: any) {
            console.log(error.message);
            toast.error("Unable to sign out");
        }
    };

    return <Button onClick={handleSignOut}>Sign Out</Button>;
};
