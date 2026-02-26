import { Link, Outlet } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { GiStrong } from "react-icons/gi";
import { TbBarbellFilled } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";

export const BottomNav = () => {
    return (
        <div className="max-w-screen-md mx-auto py-3 fixed bottom-0 left-0 right-0 bg-stone-950 text-emerald-600 font-semibold">
            <nav className="flex justify-evenly ">
                <Link to="/" className="flex flex-col items-center"><IoHome />HOME</Link>
                <Link to="/workout" className="flex flex-col items-center"><GiStrong />WORKOUT</Link>
                <Link to="/exercise" className="flex flex-col items-center"><TbBarbellFilled />EXERCISE</Link>
                <Link to="/profile" className="flex flex-col items-center"><FaUserCircle />PROFILE</Link>
            </nav>
        </div>

    )
}