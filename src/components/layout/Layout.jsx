import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
    return (
        <div className="min-h-screen pb-16 bg-stone-100 p-4">
            {children}
            <Sidebar />
        </div>
    )
}