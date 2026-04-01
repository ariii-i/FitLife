import { sanityClient } from "@/shared/lib/sanity";
import { Auth, signOut } from "firebase/auth";

import { orpc } from "@/shared/lib/orpc";
import { Schema_User_Create } from "server/src/orpc-server/packages/user/domain/schema-user";
import z from "zod";

export const getUserByFirebaseUid = async (uid: string) => {
    return await sanityClient.fetch(
        `*[_type=="user" && firebaseUid==$uid][0]{
        _id,
        firebaseUid,
        name, 
        email,
        photo
      }`,
        { uid },
    );
};

export const deleteUserApi = async (id: string) => {
    return await sanityClient.delete(id);
};

export const createUserApi = async (
    data: z.infer<typeof Schema_User_Create>,
) => {
    return orpc.user.create(data);
};

export const getUsersApi = async () => {
    return orpc.user.list({ pageIndex: 0, pageSize: 10 });
};

export const getUserApi = async (id: number) => {
    return orpc.user.find({ id });
};

export const signOuts = async (auth: Auth) => {
    return await signOut(auth);
};
