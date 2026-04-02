import { useUserStore } from "@/entities/user/modal/store";
import { auth } from "@/shared/lib/firebase";
import { UserRound } from "lucide-react";
import { Else, If, Then } from "react-if";

export const DisplayProfile = () => {
    const { user } = useUserStore()

    return (
        <div className="flex flex-col justify-center items-center">
            <If condition={auth.currentUser?.photoURL && user?.photo !== ""}>
                <Then>
                    <img
                        src={auth.currentUser?.photoURL as string}
                        alt={auth.currentUser?.displayName ?? "User Avatar"}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                </Then>
                <Else>
                    <div className="w-20 h-20 rounded-full bg-stone-600 flex items-center justify-center">
                        <UserRound className="w-10 h-10 text-stone-300" />
                    </div>
                </Else>
            </If>

            <span className="font-medium text-lg">{auth.currentUser?.displayName}</span>
            <span className="text-sm text-stone-300">{auth.currentUser?.email}</span>
        </div>
    );
};
