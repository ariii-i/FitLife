import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { router } from "../orpc-server";

const link = new RPCLink({
  url: "http://127.0.0.1:3000",
  headers: { Authorization: "Bearer token" },
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);

const user_prc = async () => {
  const res_create_user = await orpc.user.create({
    username: "sample_user_name_1",
    email: "sample_email@gmail.com",
    password: "sample_password",
  });
  console.log(res_create_user);

  const res_list_user = await orpc.user.list({
    pageIndex: 0,
    pageSize: 10,
  });
  console.log(res_list_user);

  const res_find_user = await orpc.user.find({
    id: 1,
  });
  console.log(res_find_user);
};

const exercise_rpc = async () => {
  const create_res = await orpc.exercise.create({
    name: "Push-up",
    description: "A push-up is a common calisthenics exercise beginning from the prone position.",
    user_id: 1,
    muscle_group: "Chest",
  });

  console.log(create_res);

  const res_list = await orpc.exercise.list({
    pageSize: 10,
    pageIndex: 0,
  });
  console.log(res_list);

  const find_res = await orpc.exercise.find({ id: create_res.id });
  console.log(find_res);
  console.log(
    await orpc.exercise.list_exercise_by_user({ user_id: 22, pageIndex: 0, pageSize: 10 })
  );
};

const workout_rpc = async () => {
  const create_res = await orpc.workout.create({
    name: "sampe_workout",
    user_id: 1,
    exercises: [
      {
        exercise_id: 1,
        sets: 3,
        reps: 12,
      },
    ],
  });

  console.log("----------------------------------------");
  console.log(" Creating workout with associated exercise");
  console.log("----------------------------------------");
  console.log(create_res);
  console.log("----------------------------------------");
  console.log(" // end");
  console.log("----------------------------------------");

  const res_list = await orpc.workout.list({
    pageSize: 10,
    pageIndex: 0,
  });
  console.log(res_list);

  const find_res = await orpc.workout.find({ id: create_res.id });
  console.log(find_res);

  console.log(await orpc.workout.list_workout_by_user({ user_id: 1, pageIndex: 0, pageSize: 10 }));

  console.log(
    "create_session",
    await orpc.workout.create_session({
      user_id: 1,
      duration_minutes: 25,
      workout_id: create_res.id,
      performed_at: new Date().toISOString(),
    })
  );

  console.log(
    "find_last_session_of_a_user",
    await orpc.workout.find_last_session_of_a_user({ user_id: 1 })
  );

  console.log(
    "get_current_streak_for_a_user",
    await orpc.workout.get_current_streak_for_a_user({ user_id: 1 })
  );
  console.log(
    "check_if_user_has_done_workout_on_this_date",
    await orpc.workout.check_if_user_has_done_workout_on_this_date({
      user_id: 1,
      date: "2026-03-10T15:19:00.239Z",
    })
  );
  console.log(
    "list_exercise_in_a_workout",
    await orpc.workout.list_exercise_in_a_workout({
      workout_id: 1,
    })
  );
};
export const init_client = async () => {
  console.log("Client initialized");
  // await user_rpc();
  await exercise_rpc();
  // await workout_rpc();
};
