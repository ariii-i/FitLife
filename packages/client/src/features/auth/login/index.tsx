import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginFormData, useUserStore } from "@/entities/user/modal/store";
import { useForm } from "react-hook-form"

export const LoginForm = () => {
    const { register, reset, handleSubmit } = useForm<LoginFormData>();
    const { userLogin } = useUserStore()

    const onSubmit = async (data: LoginFormData) => {
        await userLogin(data);
        reset()
    }

    return (
        <div >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <Input type="email" {...register("email")} placeholder="Email"/>

                <Input type="text" {...register("username")} placeholder="Username"/>

                <Input type="password" {...register("password")} placeholder="Password"/>

                <Button type="submit">Login</Button>
            </form>
        </div>
    )
}