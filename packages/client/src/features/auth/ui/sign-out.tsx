import { toast } from "sonner";
import { useUserStore } from "@/entities/user/modal/store";
import { auth } from "@/shared/lib/firebase";
import { Button } from "@/components/ui/button";

export const SignOut = () => {
    const { signOutUser } = useUserStore();

    const handleSignOut = async () => {
        try {
            await signOutUser(auth);
            console.log("Signed out successfully");
            toast.success("Signed out");
        } catch (error) {
            console.error(error);
            toast.error("Unable to sign out");
        }
    };

    return <Button onClick={handleSignOut}>Sign Out</Button>
}