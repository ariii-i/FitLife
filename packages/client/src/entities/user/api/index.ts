import { sanityClient } from "@/shared/lib/sanity";
import { Auth, signOut } from "firebase/auth";
import { User } from "../modal/types";

export const createSanityUser = async (data: User) => {
  try {
    const result = await sanityClient.create({
      _type: "user",
      firebaseUid: data.firebaseUid,
      name: data.name,
      email: data.email,
      photo: data.photo
    });

    return result;

  } catch (error) {
    console.error("Sanity create error:", error);
    throw error;
  }
};

export const getUserByFirebaseUid = async (uid: string) => {
  return await sanityClient.fetch(
    `*[_type=="user" && firebaseUid==$uid][0]{
        _id,
        firebaseUid,
        name, 
        email,
        photo
      }`,
    { uid }
  );
};

export const deleteUserApi = async (id: string) => {
  return await sanityClient.delete(id);
}

export const getSanityUserId = async (firebaseUid: string) => {
  const user = await sanityClient.fetch(
    `*[_type=="user" && firebaseUid == $firebaseUid][0]{ _id }`,
    { firebaseUid }
  );

  if (!user) {
    throw new Error("User not found in Sanity");
  }

  return user._id;
};

import { Schema_User_Base } from "server/src/orpc-server/packages/user/domain/schema-user";
import z from "zod";
import { orpc } from "@/shared/lib/orpc";

export const createUserApi = async (data: z.infer<typeof Schema_User_Base>) => {
  return orpc.user.create({ ...data })
};

export const getUsersApi = async () => {
  return orpc.user.list({ pageIndex: 0, pageSize: 10 })
};

export const getUserApi = async (id: number) => {
  return orpc.user.find({ id })
};

export const signOuts = async (auth: Auth) => {
  return await signOut(auth);
}

// export const deleteUserApi = async () => {
//   return null;
// }

// export const getSanityUserId = async (firebaseUid: string) => {
//   const user = await sanityClient.fetch(
//     `*[_type=="user" && firebaseUid == $firebaseUid][0]{ _id }`,
//     { firebaseUid }
//   );

//   if (!user) {
//     throw new Error("User not found in Sanity");
//   }

//   return user._id;
// };
