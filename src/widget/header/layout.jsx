import { Outlet } from "react-router-dom"
import { BottomNav } from "../navbar"
import { Header } from "."
import { Toaster } from "sonner"

export const Layout = () => {
    return (
        <div className="min-h-screen pb-16 bg-stone-100 ">
            <Header/>
            <div className="bg-stone-100 p-3 pt-19">
                <Outlet />
            </div>
            <Toaster position="top-center" />
            <BottomNav />
        </div>
    )
}