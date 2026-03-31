import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import cors from "cors";
import express from "express";
import { Model } from "objection";

import knex from "./db/knex";

// routes
import dotenv from "dotenv";
import { exercise } from "./packages/exericse/route";
import { user } from "./packages/user/route";
import { workout } from "./packages/workout/route";
// import { init_client } from "../orpc-client";

dotenv.config();

// bind Objection models to knex
Model.knex(knex);

export const router = {
  user,
  exercise,
  workout,
};

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/rpc{/*path}", async (req, res, next) => {
  const { matched } = await handler.handle(req, res, {
    prefix: "/rpc",
    context: { headers: req.headers },
  });

  if (matched) {
    return;
  }

  next();
});

app.listen(3000, () => console.log("Server listening on port 3000"));
