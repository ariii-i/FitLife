import { useEffect } from "react"
import { GoogleLogin } from "../../features/auth/login-form"
import { EditProfile } from "../../features/profile/edit-profile"
import { useUserStore } from "../../entities/user/store"
import { auth } from "../../shared/lib/firebase"
import { DisplayProfile } from "../../widget/profile/display-profile"

export const Profile = () => {
    const { users, fetchUser } = useUserStore()
    useEffect(() => {
        fetchUser(auth?.currentUser?.uid)
    }, [])
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