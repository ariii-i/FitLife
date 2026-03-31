import type { Knex } from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const common: Partial<Knex.Config> = {
  migrations: {
    directory: `${__dirname}/migrations`,
    extension: "ts",
  },
  seeds: {
    directory: `${__dirname}/seeds`,
    extension: "ts",
  },
};

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || "sqlite3",
    connection:
      process.env.DB_CLIENT === "pg"
        ? (process.env.DATABASE_URL as string)
        : { filename: process.env.SQLITE_FILE || "./dev.sqlite3" },
    useNullAsDefault: true,
    ...common,
  },
  test: {
    client: "sqlite3",
    connection: { filename: ":memory:" },
    useNullAsDefault: true,
    ...common,
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ...common,
  },
};

export default config;
