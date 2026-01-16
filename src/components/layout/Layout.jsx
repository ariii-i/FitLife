import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 min-h-screen bg-teal-100">
                <Header />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}