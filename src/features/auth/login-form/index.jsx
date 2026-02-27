import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth, googleProvider } from "../../../shared/lib/firebase";
import { Button } from "../../../shared/ui/button";
import { FcGoogle } from "react-icons/fc";

import { getUserByFirebaseUid, createSanityUser, } from "../../../entities/user/api";

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

            if (!existingUser) {
                await createSanityUser({
                    firebaseUid: firebaseUser.uid,
                    name: firebaseUser.displayName || "No Name",
                    email: firebaseUser.email,
                    photo: firebaseUser.photoURL || null,
                });

                console.log("existingUser", firebaseUser);
                console.log("existingUser", firebaseUser.photoURL);

                toast.success("Logged in with Google");
                navigate("/");

            }
        } catch (error) {
            console.log("Google login error:", error);
            toast.error("Unable to sign in with Google");
        }
    };

    const signOuts = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out");
        } catch (error) {
            toast.error("Unable to sign out");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Button onClick={signInWithGoogle}>
                <FcGoogle /> Sign in with Google
            </Button>
        </div>
    );
};