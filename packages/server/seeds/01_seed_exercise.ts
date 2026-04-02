import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("exercises").del();

  // Inserts seed entries
  await knex("exercises").insert([
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Bench Press",
      description: "Bench and press",
      muscle_group: "chest",
      image_path: "/uploads/exercise-1775038928100-55rixk.png",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Deadlift",
      description: "Barbell lifting",
      muscle_group: "legs",
      image_path: "/uploads/exercise-1775039001479-41vz2.jpeg",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Squats",
      description: "Uthne basne",
      muscle_group: "legs",
      image_path: "",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Plank",
      description: "This position",
      muscle_group: "core",
      image_path: "/uploads/exercise-1775105952533-cgh7d.webp",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Side Plank",
      description: "Plank but side ways",
      muscle_group: "core",
      image_path: "/uploads/exercise-1775106001130-1udzcb.webp",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Leg raises",
      description: "Khutta uthaune",
      muscle_group: "core",
      image_path: "/uploads/exercise-1775106006572-j35za.webp",
    },
    {
      user_id: "xZ0TYQPaxANICtcr5E78307CaTA2",
      name: "Lat Pulldown",
      description: "Tala tanne",
      muscle_group: "shoulders",
      image_path: "/uploads/exercise-1775118445283-k77dfn.jpeg",
    },
  ]);
}
