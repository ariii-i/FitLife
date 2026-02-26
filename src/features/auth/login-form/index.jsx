import { signInWithPopup, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { auth, googleProvider } from "../../../shared/lib/firebase"
import { Button } from "../../../shared/ui/button"
import { FcGoogle } from "react-icons/fc"

export const GoogleLogin = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (error) {
            toast.error("Unable to sign in with Google")
        }
    }

    const signOuts = async () => {
        try {
            await signOut(auth)
            console.log(auth?.currentUser?.email)

        } catch (error) {
            toast.error("Unable to signOut")
        }
    }

    console.log(auth?.currentUser?.email)

    return (
        <div className="flex justify-center item-center">
            <Button onClick={signInWithGoogle}> <FcGoogle/> Sign in with Google</Button>
        </div >
    )
}