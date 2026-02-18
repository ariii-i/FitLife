import { create } from "zustand";
import { sanityClient } from "../../components/lib/sanity";

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useWorkoutStore = create((set) => ({
  workouts: [],

  createWorkout: async (workoutPayload, cb) => {
    const newWorkout = await sanityClient.create({
      _type: "workout",
      name: workoutPayload.name,
      exercises: workoutPayload.exercises.map((ex) => ({
        _key: get_unique_key(),
        plannedSets: ex.plannedSets,
        plannedReps: ex.plannedReps,
        exercise: {
          _type: "reference",
          _ref: ex._id,
        },
      })),
    });

    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
    }));

    cb?.(newWorkout);
    return newWorkout;
  },

  fetchWorkouts: async () => {
    const data = await sanityClient.fetch(`
      *[_type=="workout"] | order(_createdAt desc){
        _id,
        name, 
        exercises[] { 
          plannedSets,
          plannedReps,
          exercise -> {name} 
        },
      }
    `);

    set({ workouts: data });
  },

  updateWorkout: async (id, updatedField) => {
    const updated = await sanityClient
      .patch(id)
      .set(updatedField)
      .commit();

    set((state) => ({
      workouts: state.workouts.map((w) =>
        w._id === id ? updated : w
      ),
    }));
  },

  deleteWorkout: async (id) => {
    await sanityClient.delete(id);

    set((state) => ({
      workouts: state.workouts.filter(
        (w) => w._id !== id
      ),
    }));
  },

  clearWorkouts: () => {
    set({ workouts: [] });
  },

}));
