import { sanityClient } from "@/shared/lib/sanity"
import { Workout } from "../modal/types"
import z from "zod"
import { Schema_Create_Workout, Schema_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout"
import { orpc } from "server/src/orpc-client"

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

type CreateWorkoutInput = {
  name: string
  exercises: {
    _id: string
    plannedSets: number
    plannedReps: number
  }[]
}

export const createWorkoutApi = async (data) => {
  return orpc.workout.create({ ...data, user_id: 1, });
};

export const getWorkoutApi = async () => {
  return orpc.workout.list_workout_by_user({ user_id: 1, pageIndex: 0, pageSize: 10 })
}

export const getSelectedWorkoutApi = async () => {
  return sanityClient.fetch<Workout>(
    `*[_type=="workout" && _id == $workoutId][0]{
      _id,
      name,
      exercises[]{
        _key,
        sets,
        reps,
        exercise->{
          _id,
          name
        }
      }
    }`,
    { workoutId }
  )
}

export const updateWorkoutApi = async (id: string, updatedField: Partial<Workout>): Promise<Workout> => {
  return sanityClient.patch(id).set(updatedField).commit<Workout>()
}

export const deleteWorkoutApi = async (id: string): Promise<void> => {
  await sanityClient.delete(id)
}