import assert from "assert";
import pg from "pg";
import { Users } from "../models/users.js";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
assert(!!connectionString, "environment variable DATABASE_URL not set");

const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Users: new Users(pool),
  },
};

// export const pool = new Pool({
//   connectionString,
// });
// pool.connect((err) => {
//   if (err) {
//     console.error(err);
//     throw new Error("Failed to connect to the database.");
//   }
// });
