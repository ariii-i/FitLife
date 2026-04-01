import { useStreakStore } from "@/entities/streak/modal/store";
import { auth } from "@/shared/lib/firebase";
import { cn } from "@/shared/lib/utils";
import { Activity, Check } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const getDayName = (dateStr: string) => {
	const date = new Date(dateStr + "T00:00:00");
	return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const StreakView = () => {
	const { streakData, fetchStreak } = useStreakStore();

	// const sortedData = [...streakData].sort(
	//   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	// );

	// let streak = 0;

	// for (const day of sortedData) {
	//   if (day.done) {
	//     streak++;
	//   } else {
	//     break;
	//   }
	// }

	useEffect(() => {
		fetchStreak(auth.currentUser?.uid || "");
	}, [fetchStreak]);

	return (
		<div className="space-y-3">

			<div className="flex flex-wrap gap-2">
				{streakData.map((item) => (
					<div
						key={item.date}
						className="flex flex-col justify-center items-center w-20 sm:w-24 md:w-28"
					>
						<Link
							to={`/workout-history-chart/${item.date}`}
							className={cn(
								"flex flex-col items-center justify-center w-full h-16 rounded-lg text-black",
								item.done ? "bg-[#A1FAFF]" : "bg-[#FFA1A1]",
							)}
						>
							{item.done ? <Check className="w-5 h-5" /> : ""}
						</Link>
						<span className="text-center mt-1 text-sm sm:text-base">
							{getDayName(item.date)}
						</span>
					</div>
				))}
			</div>

			<div className="flex justify-end">
				<Link
					to={`/workout-history-chart/${new Date().toISOString().split("T")[0]}`}
					className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
				>
					<Activity className="w-4 h-4" />
					View Workout Charts
				</Link>
			</div>
		</div>
	);
};
