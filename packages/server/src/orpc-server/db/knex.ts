import Knex from "knex";
import { config } from "../../../knexfile";

const env = process.env.NODE_ENV || "development";
export const knex = Knex(config[env]);
export default knex;
