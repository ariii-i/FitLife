import { useEffect } from "react"
import { GoogleLogin } from "../../features/auth/login-form"
import { EditProfile } from "../../features/profile/edit-profile"
import { auth } from "@/shared/lib/firebase"
import { useUserStore } from "@/entities/user/modal/store"
import { SignOut } from "@/features/auth/sign-out"
import { DisplayProfile } from "@/widget/profile/display-profile"

export const Profile: React.FC = () => {
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
                {/* <GoogleLogin /> */}
                
                <DisplayProfile />
                <EditProfile />
            </div>
        </div>
    )
}