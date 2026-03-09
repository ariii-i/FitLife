import { create } from "zustand";
import { createSanityUser, deleteUserApi, getUserByFirebaseUid } from "./api";
import { auth } from "../../shared/lib/firebase";
import { signOut } from "firebase/auth";

export const useUserStore = create((set) => ({
    user: null,

    userLogin: async (data) => {
        const newUser = await createSanityUser(data);

        set((state) => ({
            user: [newUser, ...state.user],
        }));

    },

    fetchUser: async (uid) => {
        console.log("FETCH USER UID:", uid);
        if (!uid) {
            console.error("UID is undefined");
            return;
        }
        const data = await getUserByFirebaseUid(uid);
        set({ user: data });
    },

    setUsers: (user) => ({ user }),

    deleteUsers: (id) => {
        deleteUserApi(id)

        set((state) => ({
            user: state.user.filter((u) => u._id !== id)
        }))
    },

    signOutUser: async () => {
        await signOut(auth);
        set({ user: null })
    }
}))