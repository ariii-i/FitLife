import { sanityClient } from "../../shared/lib/sanity"

export const getUserApi = async () => {
    return await sanityClient.fetch(`*[_type=="user"]{
        _id,
        name,
        email
        }`
    )
}

export const deleteUserApi = async (id) => {
    return await sanityClient.delete(id);
}