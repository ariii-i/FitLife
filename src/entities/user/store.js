import { create } from "zustand";
import { createSanityUser, deleteUserApi, getUserByFirebaseUid } from "./api";

export const useUserStore = create((set) => ({
    users: [],
    user: null,

    userLogin: async (data) => {
        const newUser = await createSanityUser(data);

        set((state) => ({
            users: [newUser, ...state.users],
        }));

    },

    fetchUser: async (uid) => {
        console.log("FETCH USER UID:", uid);
        if (!uid) {
            console.error("UID is undefined. Stopping fetch.");
            return;
        }
        const data = await getUserByFirebaseUid(uid);
        set({ user: data });
    },

    setUsers: (users) => ({ users }),

    deleteUsers: (id) => {
        deleteUserApi(id)

        set((state) => ({
            users: state.users.filter((u) => u._id !== id)
        }))
    },
}))