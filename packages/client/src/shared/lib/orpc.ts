import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { router } from "server/src/orpc-server";

export const API_BASE_URL = "http://127.0.0.1:3000/rpc";
export const IMAGE_PATH_BASE = "http://127.0.0.1:3000";

const link = new RPCLink({
	url: API_BASE_URL,
	// headers: { Authorization: "Bearer token" },
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
