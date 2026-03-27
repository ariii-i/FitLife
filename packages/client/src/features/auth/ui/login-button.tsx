import { useUserStore } from "@/entities/user/modal/store";
import { FcGoogle } from "react-icons/fc";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { signInWithGoogle } from "./service";

export const LoginWithGoogle = () => {
    const { user, setUsers } = useUserStore()
    const navigate = useNavigate();

    if (user) {
        return <Navigate to='/' replace />
    }

    const login_hanler = async () => {
        const res= await signInWithGoogle()
        if(!res) {
          return   
        }
        const { uid, email, displayName, photoURL }  = res as any
        setUsers(res)
        navigate("/");
    }

    return (
        <div className="flex flex-col p-5 justify-center items-center gap-2">
            <Button onClick={login_hanler}>
                <FcGoogle /> Sign in with Google
            </Button>
            {/* <LoginForm/> */}
        </div>
    );
};

