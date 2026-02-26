import { useState } from "react";
import { useForm } from "react-hook-form"
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";

export const Registration = () => {
    const { register, handleSubmit } = useForm();
    return (
        <div>
            <h1>Register</h1>

            <form >
                <Input {...register("email")} type="email"/>
                <Input {...register("password")} type="password"/>
                <Input {...register("confirmPassword")} type="password"/>
                <Button>SignUp</Button>
            </form>
        </div>
    )
}