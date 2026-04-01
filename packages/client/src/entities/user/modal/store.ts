import { auth, googleProvider } from "@/shared/lib/firebase";
import { signInWithPopup, User } from "firebase/auth";
import { create } from "zustand";
import { createUserApi, deleteUserApi, getUserByFirebaseUid } from "../api";

type UserStore = {
  user: (User & { photo: string; name: string }) | null;
  userLogin: (data: Partial<User>) => Promise<void>;
  handleLogin: (nabigate: any) => Promise<void>;
  fetchUser: (uid: string) => Promise<void>;
  setUsers: (user: User) => void;
  deleteUsers: (id: string) => void;
  signOutUser: (naviagte: any) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  userLogin: async (data: any) => {
    // const newUser = await createSanityUser(data);
    set({ user: null });
  },
  handleLogin: async (navigate) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // let existingUser = await getUserByFirebaseUid(firebaseUser.uid);

      // if (!existingUser?._id) {
      //   // await createSanityUser({
      //   //   firebaseUid: firebaseUser.uid,
      //   //   name: firebaseUser.displayName || "No Name",
      //   //   email: firebaseUser.email,
      //   //   photo: firebaseUser.photoURL || null,
      //   // });
      //   //   toast.success("Account created");
      // } else {
      //   //   toast.success("Logged in");
      // }
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
    deleteUserApi(id);

    set((state) => ({
      user: state.user && state.user?._id === id ? null : state.user,
    }));
  },

  signOutUser: async (navigate) => {
    set({ user: null });
    navigate("/login");
  },
}));
