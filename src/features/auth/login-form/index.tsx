import { useUserStore } from "@/entities/user/modal/store";
import { FcGoogle } from "react-icons/fc";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button";
import { signInWithGoogle } from "./service";

export const GoogleLogin = () => {
    const { user } = useUserStore()
    const navigate = useNavigate();

    if (user) {
        return <Navigate to='/' replace />
    }

    return (
        <div className="flex flex-col p-5 justify-center items-center gap-2">
            <Button onClick={() => signInWithGoogle(navigate)}>
                <FcGoogle /> Sign in with Google
            </Button>
        </div>
    );
};

