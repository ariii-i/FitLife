import { create } from "zustand";
import { createSanityUser, deleteUserApi, getUserByFirebaseUid, signOuts } from "../api";
import { User } from "./types";

type UserStore = {
    user: User | null;
    userLogin: (data: Partial<User>) => Promise<void>;
    fetchUser: (uid: string) => Promise<void>;
    setUsers: (user: User) => void;
    deleteUsers: (id: string) => void;
    signOutUser: (auth: any) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,

    userLogin: async (data: any) => {
        const newUser = await createSanityUser(data);
        set({ user: newUser });
    },

    fetchUser: async (uid: string) => {
        if (!uid) {
            console.error("UID is undefined");
            return;
        }
        const data = await getUserByFirebaseUid(uid);
        set({ user: data });
    },

    setUsers: (user: any) => ({ user }),

    deleteUsers: (id: string) => {
        deleteUserApi(id)

        set((state) => ({
            user: state.user && state.user._id === id ? null : state.user,
        }));
    },

    signOutUser: async (auth: any) => {
        await signOuts(auth)
        set({ user: null })
    }, 
    
}))