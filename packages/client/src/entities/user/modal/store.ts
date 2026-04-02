import { auth, googleProvider } from "@/shared/lib/firebase";
import { signInWithPopup, User } from "firebase/auth";
import { create } from "zustand";
import { createUserApi } from "../api";

type UserStore = {
    user: (User & { photo: string; name: string }) | null;
    handleLogin: (nabigate: any) => Promise<void>;
    setUsers: (user: User) => void;
    // deleteUsers: (id: string) => void;
    signOutUser: (naviagte: any) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,

    handleLogin: async (navigate) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            
            await createUserApi({
                user_id: firebaseUser.uid,
                username: firebaseUser.displayName || "No Name",
                email: firebaseUser.email + "",
            });
            set({ user: firebaseUser as any });
            navigate("/");
        } catch (error) {
            console.log("Google login error:", error);
        }
    },

    setUsers: (user: any) => ({ user }),

    signOutUser: async (navigate) => {
        set({ user: null });
        navigate("/login");
    },
}));
