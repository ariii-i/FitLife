import { sanityClient } from "@/shared/lib/sanity";
import { Workout } from "../modal/types";

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type SanityWorkoutExercise = {
  _type: "object";
  _key: string;
  plannedSets: number;
  plannedReps: number;
  exercise: {
    _type: "reference";
    _ref: string;
  };
};

// export const createWorkoutApi = async (data: { name: string; exercises: { _id: string; plannedSets: number; plannedReps: number }[] }): Promise<Workout> => {
//     return sanityClient.create<Workout>({
//         _type: "workout",
//         name: data.name,
//         exercises: data.exercises.map((ex) : SanityWorkoutExercise => ({
//             _type: "object",
//             _key: get_unique_key(),
//             plannedSets: ex.plannedSets,
//             plannedReps: ex.plannedReps,
//             exercise: {
//                 _type: "reference",
//                 _ref: ex._id,
//             },
//         })),
//     })as Promise<Workout>;
// }

export const getWorkoutApi = async (): Promise<Workout[]> => {
    return sanityClient.fetch<Workout[]>(`
      *[_type=="workout"] | order(_createdAt desc){
        _id,
        name, 
        exercises[] { 
          plannedSets,
          plannedReps,
          exercise -> {name} 
        }
      }
    `);
}

export const getSelectedWorkoutApi = async (workoutId: string): Promise<Workout> => {
    return sanityClient.fetch(`*[_type=="workout" && _id == $workoutId][0]{
        _id,
        name,
        exercises[]{
            _key,
            plannedSets,
            plannedReps,
            exercise->{
                _id,
                name
                }
        }}`,
        { workoutId });
}

export const updateWorkoutApi = async (id: string, updatedField: Partial<Workout>): Promise<Workout> => {
    return sanityClient.patch(id).set(updatedField).commit();
};

export const deleteWorkoutApi = (id: string) => {
    return sanityClient.delete(id);
}