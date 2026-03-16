import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer } from "node:http";
import { Model } from "objection";

import knex from "./db/knex";

// routes
import { exercise } from "./packages/exericse/route";
import { workout } from "./packages/workout/route";
import { init_client } from "../orpc-client";
import dotenv from "dotenv";
import { user } from "./packages/user/route";

dotenv.config();

// bind Objection models to knex
Model.knex(knex);

export const router = {
  user,
  exercise,
  workout,
};

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: { headers: req.headers },
  });

  if (!result.matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
  init_client();
});
