import { RouterClient } from "@orpc/client";
import { router } from "server/src/orpc-server"
export const orpc: RouterClient<typeof Router> = createORPCClient(link);