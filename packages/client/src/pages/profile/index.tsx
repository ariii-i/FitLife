import { useEffect } from "react"
import { EditProfile } from "../../features/profile/edit-profile"
import { auth } from "@/shared/lib/firebase"
import { useUserStore } from "@/entities/user/modal/store"
import { DisplayProfile } from "@/widget/profile/display-profile"
import { SignOut } from "@/features/auth/ui/sign-out"

export const Profile = () => {
    const { user, fetchUser } = useUserStore();
    const currentUser = auth.currentUser

    useEffect(() => {
        if (currentUser) {
            fetchUser(currentUser.uid)
        }
    }, [fetchUser])

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            {/* <span className="font-semibold text-lg">Profile</span> */}

            <div>

                <DisplayProfile />

                <div className="flex gap-2">
                    <EditProfile />
                    <SignOut />
                </div>
            </div>
        </div>
    )
}