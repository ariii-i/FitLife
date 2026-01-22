import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
    return (
        <div className="min-h-screen pb-16 bg-teal-100 p-4">
            {children}
            <Sidebar />
        </div>
    )
}