import { auth, googleProvider } from "@/shared/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";

export const signInWithGoogle = async ()  => {
   try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        console.warn(firebaseUser)
        return firebaseUser
    } catch (error) {
        console.log("Google login error:", error);
        toast.error("Unable to sign in with Google");
    }
};