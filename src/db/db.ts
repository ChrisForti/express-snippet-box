import assert from "assert";
import pg from "pg";
import { Users } from "../models/user-model.js";
import { Tokens } from "../models/token-model.js";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
assert(!!connectionString, "environment variable DATABASE_URL not set");

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Tokens: new Tokens(pool),
    Users: new Users(pool),
  },
};
