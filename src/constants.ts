import assert from "assert";
import "dotenv/config";

export const connectionString = process.env.DSN;
assert(
  connectionString,
  "Connection string is required. Set DSN enviroment variable."
);
