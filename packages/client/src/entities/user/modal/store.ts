import { Schema_User_Base, Schema_User_Create, Schema_User_Update } from "server/src/orpc-server/packages/user/domain/schema-user";
import z from "zod";
import { create } from "zustand";
import { createUserApi, getUserApi, getUsersApi } from "../api";
import { Type_User } from "./types";

export type LoginFormData = z.infer<typeof Schema_User_Base>;

type UserStore = {
    user: Type_User | null;
    userLogin: (data: z.infer<typeof Schema_User_Create>) => Promise<void>;
    fetchUser: (id: number) => Promise<void>;
    setUsers: (user: Type_User & any) => void;
    // updateUsers: (user: z.infer<typeof Schema_User_Update>) => Promise<void>;
    // deleteUsers: (id: number) => void;
    signOutUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    
    setUsers: (user) => {
        set({ user })
    },
    
    userLogin: async (data) => {
        const newUser = await createUserApi(data);
        set({ user: newUser });
    },

    fetchUser: async (id: number) => {
        if (!id) {
            console.error("UID is undefined");
            return;
        }
        const data = await getUserApi(id);
        set({ user: data });
    },


    // updateUser:()=>{
    //     const updated=await updateuserA
    // },

    // deleteUsers: (id: number) => {
    //     set((state) => ({
    //         user: user.id === id ? null : state.user,
    //     }));
    // },

    signOutUser: async () => {
        set({ user: null });
    },

}))