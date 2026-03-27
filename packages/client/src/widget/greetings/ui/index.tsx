import { useUserStore } from "@/entities/user/modal/store"

export const Greeting = () => {
    const { user } = useUserStore()
    return (
        <div className="font-semibold text-xl">
            Hi, {user?.displayName}
        </div>

    )
}