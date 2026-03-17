import { sanityClient } from "@/shared/lib/sanity";
import { Exercise } from "../modal/types";

type ExerciseInput = {
  exercise: string
}

export const createExerciseApi = async (data: ExerciseInput): Promise<Exercise> => {
  return sanityClient.create({
    _type: "exercise",
    name: data.exercise,
  });
};

export const getExerciseApi = async (): Promise<Exercise[]> => {
  return sanityClient.fetch(`
      *[_type=="exercise"] | order(_createdAt desc){
        _id,
        name
      }
  `)
}

export const deleteExerciseApi = async (id: string): Promise<void> => {
  await sanityClient.delete(id)
}

export const editExerciseApi = async (id: string, name: string): Promise<Exercise> => {
  return sanityClient.patch(id).set({ name }).commit()
}