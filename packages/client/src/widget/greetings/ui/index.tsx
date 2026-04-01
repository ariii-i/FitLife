import { auth } from "@/shared/lib/firebase";

export const Greetings = () => {
    const currentUser = auth.currentUser;

    return (
        <span className="font-medium text-2xl">Hi, {currentUser?.displayName}</span>
    );
};
