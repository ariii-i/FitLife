import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../shared/lib/firebase";
import { Button } from "../../../shared/ui/button";
import { FcGoogle } from "react-icons/fc";
import { getUserByFirebaseUid, createSanityUser, } from "../../../entities/user/api";
import { toast } from "sonner";

export const GoogleLogin = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            console.log("FULL FIREBASE USER:", firebaseUser);
            console.log("photoURL:", firebaseUser.photoURL);
            console.log("providerData:", firebaseUser.providerData);

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

    const signOuts = async () => {
        try {
            await signOut(auth);
            console.log("signed outtt", auth)
            toast.success("Signed out");
        } catch (error) {
            toast.error("Unable to sign out");
        }
    };

    return (
        <div className="flex flex-col p-5 justify-center items-center gap-2">
            <Button onClick={signInWithGoogle}>
                <FcGoogle /> Sign in with Google
            </Button>
            <Button onClick={signOuts}>SignOut</Button>
        </div>
    );
};