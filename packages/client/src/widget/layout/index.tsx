import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { BottomNav } from "./footer";
import { Header } from "./header";

export const Layout = () => {
    return (
        <div className="relative h-full flex flex-col">
            <Header />
            <div className="p-3 pt-8 flex-1">
                <Outlet />
            </div>
            <BottomNav />
            <Toaster position="top-center" />
        </div>
    );
};
