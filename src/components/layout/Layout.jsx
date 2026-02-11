import { Toaster } from "sonner";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 pb-16">
                <Outlet/>
            </div>
            <Footer />
            <Toaster position="top-center" richColors />
        </div>
    )
}