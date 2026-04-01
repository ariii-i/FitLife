import { FaUserCircle } from "react-icons/fa";
import { GiStrong } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { TbBarbellFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

export const BottomNav = () => {
    return (
        <div className="mb-5 fixed bottom-5 left-1/2 bg-stone-900/40 flex gap-1 justify-between items-center shadow-lg overflow-hidden border border-stone-700 rounded-xl md:p-2.5 max-w-2xl mx-auto md:backdrop-blur -translate-x-1/2">
            <div className="absolute inset-0 backdrop-blur -z-10 "></div>
            <Link
                to="/"
                className="h-8 w-8 bg-transparent flex items-center justify-center rounded-md hover:bg-stone-700 duration-150 transition-all"
            >
                <IoHome />
            </Link>
            <Link
                to="/workout"
                className="h-8 w-8 bg-transparent flex items-center justify-center rounded-md hover:bg-stone-700 duration-150 transition-all"
            >
                <GiStrong />
            </Link>
            <Link
                to="/exercise"
                className="h-8 w-8 bg-transparent flex items-center justify-center rounded-md hover:bg-stone-700 duration-150 transition-all"
            >
                <TbBarbellFilled />
            </Link>
            <Link
                to="/profile"
                className="h-8 w-8 bg-transparent flex items-center justify-center rounded-md hover:bg-stone-700 duration-150 transition-all"
            >
                <FaUserCircle />
            </Link>
        </div>
    );
};
