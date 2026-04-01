import { useUserStore } from "@/entities/user/modal/store";
import { UserRound } from "lucide-react";

export const DisplayProfile = () => {
    const { user } = useUserStore();

    console.log("Photo URL:", user?.photo)

    return (
        <div className="flex flex-col justify-center items-center">
            {user?.photo && user.photo !== "" ? (
                <img src={user.photo} alt={user.name ?? "User Avatar"} className="w-20 h-20 rounded-full object-cover" />
            ) : (
                <div className="w-20 h-20 rounded-full bg-stone-600 flex items-center justify-center">
                    <UserRound className="w-10 h-10 text-stone-300" />
                </div>
            )}

            <span className="font-semibold text-lg">{user?.name}</span>
            <span className="text-sm text-stone-700">{user?.email}</span>
        </div>
    )
}