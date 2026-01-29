import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
    return (
        <div className="min-h-screen pb-16 bg-stone-100 p-4">
            {children}
            <Sidebar />
            <Toaster position="top-center" richColors />
        </div>
    )
}