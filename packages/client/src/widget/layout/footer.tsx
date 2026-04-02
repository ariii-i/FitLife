import { BicepsFlexed, CircleUserRound, Dumbbell, House } from "lucide-react";
import { NavLink } from "react-router-dom";

type LinkCardProps = {
    to: string;
    icon: React.ReactNode;
    label: string;
};

const LinkCard = ({ to, icon, label }: LinkCardProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-md px-3 py-2 transition-all duration-150 font-medium
                ${isActive ? "text-emerald-400 bg-stone-700" : "text-stone-300 hover:bg-stone-700"}`
            }
        >
            {icon}
            <span className="text-xs sm:text-sm mt-1">{label}</span>
        </NavLink>
    );
};

export const BottomNav = () => {
    return (
        <div className="mb-5 fixed bottom-5 left-1/2 bg-stone-900/40 flex gap-1 justify-between items-center shadow-lg overflow-hidden border border-stone-700 rounded-xl md:p-2.5 max-w-5xl mx-auto md:backdrop-blur -translate-x-1/2">
            <div className="absolute inset-0 backdrop-blur -z-10"></div>

            <LinkCard to="/" icon={<House />} label="Home" />
            <LinkCard to="/workout" icon={<BicepsFlexed />} label="Workouts" />
            <LinkCard to="/exercise" icon={<Dumbbell />} label="Exercise" />
            <LinkCard to="/profile" icon={<CircleUserRound />} label="User" />
        </div>
    );
};