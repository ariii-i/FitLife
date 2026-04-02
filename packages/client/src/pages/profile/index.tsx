import { SignOut } from "@/features/auth/ui/sign-out"
import { DisplayProfile } from "@/widget/profile/display-profile"

export const Profile = () => {

    return (
        <div className="flex flex-col flex-1 gap-3 items-center justify-center space-y-2">
            <DisplayProfile />

            <div className="flex justify-center items-center">
                <SignOut />
            </div>

        </div>
    )
}