import { useUserStore } from "@/entities/user/modal/store";
import { FcGoogle } from "react-icons/fc";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export const LoginWithGoogle = () => {
  const { user, handleLogin } = useUserStore();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handle_login = async () => {
    handleLogin(navigate);
  };

  return (
    <div className="flex flex-col p-5 justify-center items-center gap-2">
      <Button onClick={handle_login}>
        <FcGoogle /> Sign in with Google
      </Button>
    </div>
  );
};
