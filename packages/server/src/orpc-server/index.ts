import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
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

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || "";

  if (url.startsWith("/uploads/")) {
    const fileName = url.replace("/uploads/", "");
    const filePath = path.join(__dirname, "..", "..", "uploads", fileName);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(fileName).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.writeHead(404);
      res.end("File not found");
      return;
    }
  }

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
  // init_client();
});
