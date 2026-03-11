import { sanityClient } from "../../shared/lib/sanity"

export const createExerciseApi = (data) => {
  return sanityClient.create({
    _type: "exercise",
    name: data.exercise,
  })
}

export const getExerciseApi = () => {
  return sanityClient.fetch(`
      *[_type=="exercise"] | order(_createdAt desc){
        _id,
        name
      }
    `)
}

export const deleteExerciseApi = (id) => {
  return  sanityClient.delete(id)
}

export const editExerciseApi = (id, updatedField) => {
  return sanityClient.patch(id).set(updatedField).commit()
}