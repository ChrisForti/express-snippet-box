import pg from "pg";
import { connectionString } from "../constants.js";

const { Pool } = pg;
export const pool = new Pool({
  connectionString,
});
pool.connect((err) => {
  if (err) {
    console.error(err);
    throw new Error("Failed to connect to the database.");
  }
});
