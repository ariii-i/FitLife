"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = require("url");
const path_1 = require("path");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = (0, path_1.dirname)(__filename);
dotenv_1.default.config();
const common = {
    migrations: {
        directory: `${__dirname}/migrations`,
        extension: "ts",
    },
    seeds: {
        directory: `${__dirname}/seeds`,
        extension: "ts",
    },
};
exports.config = {
    development: {
        client: process.env.DB_CLIENT || "sqlite3",
        connection: process.env.DB_CLIENT === "pg"
            ? process.env.DATABASE_URL
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
exports.default = exports.config;
//# sourceMappingURL=knexfile.js.map