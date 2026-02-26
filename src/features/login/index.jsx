import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../shared/ui/button"
import { Input } from "../../shared/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import { auth } from "../../shared/lib/firebase"
import { useNavigate } from "react-router-dom"

export const LoginFom = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit } = useForm();

    const onRegister = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            toast.success("Account created successfully")
            navigate('/');

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                toast.error("This email is already registered. Please login instead.");
            } else {
                toast.error(error.message);
            }
        }
    }

    const onLogin = async (data) => {
        try {
            await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            navigate("/");
        } catch (error) {
            toast.error("Incorrect email or password.")
        }
    }

    return (
        <div className="bg-stone-300 p-3 max-w-sm mx-auto rounded-xl">
            <div>
                <Button onClick={() => setIsLogin(true)} variant={isLogin ? 'default' : "ghost"}>Login</Button>
                <Button onClick={() => setIsLogin(false)} variant={!isLogin ? "default" : "ghost"}>SignUp</Button>
            </div>

            {
                isLogin ? <div>
                    <h2 className="font-semibold">Login Form</h2>

                    <form className="space-y-2 py-2" onSubmit={handleSubmit(onLogin)}>
                        <Input type="email" {...register("email")} placeholder="Email" />

                        <div className="relative">
                            <Input type={showPassword ? "text" : "password"}{...register("password")} placeholder="Password" />
                            <Button variant="ghost" className="absolute top-0 right-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>

                        <div className="text-gray-500 text-sm">Forgot Password?</div>

                        <Button type="submit" className="w-full">Login</Button>
                    </form>

                    <div className="text-gray-500 text-sm">
                        Don't have an account? <span className="underline"><a href="#" onClick={() => setIsLogin(false)}>SignUp.</a></span>
                    </div>
                </div> : <div>
                    <h2 className="font-semibold">SignUp Form</h2>

                    <form className="space-y-2 py-2" onSubmit={handleSubmit(onRegister)}>
                        <Input type="text" {...register("name")} placeholder="Username" />
                        <Input type="email" {...register("email")} placeholder="Email" />

                        <div className="relative">
                            <Input type={showPassword ? "text" : "password"}{...register("password")} placeholder="Password" />
                            <Button type="button" className="absolute right-0 top-0" variant="ghost" onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <Eye /> : <EyeOff />}</Button>
                        </div>

                        <div className="relative w-full">
                            <Input type={showConfirmPassword ? "text" : "password"}{...register("confirmPassword")} placeholder="Confirm Password" />
                            <Button type="button" variant="ghost" className="absolute right-0 top-0" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{!showConfirmPassword ? <Eye /> : <EyeOff />}</Button>
                        </div>

                        <Button type="submit" className="w-full">SignUp</Button>
                    </form>

                    <div className="text-gray-500 text-sm">
                        Already have an account? <span className="underline"><a href="#" onClick={() => setIsLogin(true)}>Login.</a></span>
                    </div>
                </div>
            }

        </div >
    )
}