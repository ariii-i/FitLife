import { useStreakStore } from "@/entities/streak/modal/store";

export const StreakLog = () => {
    const { streak } = useStreakStore();

    return (
            <div className="w-80 text-lg  text-center p-10 bg-gray-800 border border-gray-700 text-white rounded-md flex flex-col justify-center items-center ">
                <p className="font-semibold text-xl">Streak </p>
                <p className="font-bold text-3xl">{streak} </p>
                <p>{streak > 1 ? " days" : " day"}</p>
            </div>
    )
}