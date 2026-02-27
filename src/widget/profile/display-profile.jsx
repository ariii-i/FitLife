import { useUserStore } from "../../entities/user/store"
import { Card, CardContent, CardHeader } from "../../shared/ui/card"

export const DisplayProfile = () => {
    const { users, user } = useUserStore()
    console.log(user?.photo)
    return (
        <div>
            {/* <pre>,,{JSON.stringify(user, null, 2)}</pre> */}

            <div className="flex flex-col justify-center items-center">
                <img src={user?.photo} className="w-20 h-20 rounded-full object-cover" />
{user?.photo == null }
                <span className="font-semibold text-lg">{user?.name}</span>
                <span className="text-sm text-stone-700">{user?.email}</span>

                <Card className="bg-stone-700 text-stone-100">
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
                </Card>
            </div>
        </div>
    )
}