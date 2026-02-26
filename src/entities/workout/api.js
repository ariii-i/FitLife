import { sanityClient } from "../../shared/lib/sanity"

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutApi = (data) => {
    return sanityClient.create({
        _type: "workout",
        name: data.name,
        exercises: data.exercises.map((ex) => ({
            _type: "object",
            _key: get_unique_key(),
            plannedSets: ex.plannedSets,
            plannedReps: ex.plannedReps,
            exercise: {
                _type: "reference",
                _ref: ex._id,
            },
        })),
    })
}

export const getWorkoutApi = () => {
    return sanityClient.fetch(`
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

export const getSelectedWorkoutApi = (workoutId) => {
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

export const updateWorkoutApi=(id, updatedField)=>{
    return sanityClient.patch(id).set(updatedField).commit();
}

export const deleteWorkoutApi=(id)=>{
    return sanityClient.delete(id);
}