import { Outlet } from "react-router-dom"
import { BottomNav } from "./footer"
import { Toaster } from "sonner"
import { Header } from "./header"

export const Layout = () => {
    return (
        <div className="min-h-screen pb-16 bg-stone-100 ">
            <Header/>
            <div className="bg-stone-100 p-3 pt-19">
                <Outlet />
            </div>
            <BottomNav />
            <Toaster position="top-center" />
        </div>
    )
}