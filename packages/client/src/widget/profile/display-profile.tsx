import { useUserStore } from "@/entities/user/modal/store";
import { UserRound } from "lucide-react";
import { Else, If, Then } from "react-if";

export const DisplayProfile = () => {
    const { user } = useUserStore();

    return (
        <div className="flex flex-col justify-center items-center">
            <If condition={user?.photoURL}>
                <Then>
                    <img src={user?.photoURL} alt={user?.displayName ?? "User Avatar"} className="w-20 h-20 rounded-full object-cover" />
                </Then>
                <Else>
                <div className="w-20 h-20 rounded-full bg-stone-600 flex items-center justify-center">
                    <UserRound className="w-10 h-10 text-stone-300" />
                </div>
                </Else>
            </If>
            {/* {user?.photoURL && user.photoURL !== "" ? (
            ) : (
            {/* )} */}

            <span className="font-semibold text-lg">{user?.displayName}</span>
            <span className="text-sm text-stone-700">{user?.email}</span>


            {/* <Card className="bg-stone-700 text-stone-100">
                <CardHeader>My details</CardHeader>

                <CardContent className="flex gap-10">
                    <div>
                        Weight

                    </div>

                    <div>
                        Height

                    </div>

                    <div>
                        Total time

                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}