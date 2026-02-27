import { sanityClient } from "../../shared/lib/sanity"

export const createSanityUser = async (data) => {
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

export const getUserByFirebaseUid = async (uid) => {
  console.log("UID RECEIVED:", uid);
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

// export const getUserApi = async () => {
//     return await sanityClient.fetch(`*[_type=="user"]{
//         _id,
//         name,
//         email
//         }`
//     )
// }

export const deleteUserApi = async (id) => {
  return await sanityClient.delete(id);
}