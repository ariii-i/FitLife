import { create } from "zustand";
import { sanityClient } from "../../components/lib/sanity";

export const useUserStore = create((set) => ({
    users: [],

    fetchUsers: async () => {
        const data=await sanityClient.fetch(`
            *[_type=="user"]{
                name,
                email
                }`
            )
        set({users:data})
    },

    setUsers: (users) => ({ users }),

    deleteUsers: async (id) => {
        await sanityClient.delete(id);

        set((state) => ({
            users: state.users.filter((u) => u._id !== id)
        }))
    },
}))