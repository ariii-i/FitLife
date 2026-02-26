import { create } from "zustand";
import { deleteUserApi, getUserApi } from "./api";

export const useUserStore = create((set) => ({
    user: null,
    users: [],

    fetchUsers: () => {
        const data = getUserApi();

        set({ users: data })
    },

    setUsers: (users) => ({ users }),

    deleteUsers: (id) => {
        deleteUserApi(id)

        set((state) => ({
            users: state.users.filter((u) => u._id !== id)
        }))
    },
}))