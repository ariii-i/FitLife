import { useUserStore } from "@/entities/user/modal/store";
import { UserRound } from "lucide-react";
import { Else, If, Then } from "react-if";

export const DisplayProfile = () => {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col justify-center items-center">
      <If condition={user?.photo && user.photo !== ""}>
        <Then>
          <img
            src={
              "https://lh3.googleusercontent.com/a/ACg8ocLD6nFneNfXtHGl9iYWQNTsMd4FuBUle6E9uo48oYDLuoxBLbMb=s96-c"
            }
            alt={user?.name ?? "User Avatar"}
            className="w-20 h-20 rounded-full object-cover"
          />
        </Then>
        <Else>
          <div className="w-20 h-20 rounded-full bg-stone-600 flex items-center justify-center">
            <UserRound className="w-10 h-10 text-stone-300" />
          </div>
        </Else>
      </If>

      <span className="font-semibold text-lg">{user?.name}</span>
      <span className="text-sm text-stone-700">{user?.email}</span>
    </div>
  );
};
