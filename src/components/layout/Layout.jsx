import { Toaster } from "sonner";
import { Footer } from "./Footer";

export function Layout({ children }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 pb-16">
                {children}
            </div>
            <Footer />
            <Toaster position="top-center" richColors />
        </div>
    )
}