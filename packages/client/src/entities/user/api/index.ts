import { Auth, signOut } from "firebase/auth";
import { orpc } from "server/src/orpc-client";
import { Schema_User_Base } from "server/src/orpc-server/packages/user/domain/schema-user";
import z from "zod";

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
