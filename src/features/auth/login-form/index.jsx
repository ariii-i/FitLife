import { signInWithPopup, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../shared/lib/firebase";
import { Button } from "../../../shared/ui/button";
import { FcGoogle } from "react-icons/fc";
import { getUserByFirebaseUid, createSanityUser, } from "../../../entities/user/api";
import { toast } from "sonner";
import { useUserStore } from "../../../entities/user/store";

export const GoogleLogin = () => {
    const {user}=useUserStore()
    const navigate = useNavigate();

    if(user){
        return <Navigate to='/' replace/>
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const existingUser = await getUserByFirebaseUid(firebaseUser.uid);

            if (!existingUser?._id) {
                await createSanityUser({
                    firebaseUid: firebaseUser.uid,
                    name: firebaseUser.displayName || "No Name",
                    email: firebaseUser.email,
                    photo: firebaseUser.photoURL || null,
                });
                toast.success("Account created");
            } else {
                toast.success("Logged in");
            }
            navigate("/");
        } catch (error) {
            console.log("Google login error:", error);
            toast.error("Unable to sign in with Google");
        }
    };

    return (
        <div className="flex flex-col p-5 justify-center items-center gap-2">
            <Button onClick={signInWithGoogle}>
                <FcGoogle /> Sign in with Google
            </Button>
        </div>
    );
};

