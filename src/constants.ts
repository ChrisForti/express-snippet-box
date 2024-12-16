import assert from "assert";
import "dotenv/config";

export const connectionString = process.env.DSN;
assert(
  connectionString,
  "Connection string is required. Set DSN enviroment variable."
);

export const nodemailerUser = process.env.NODEMAILER_USER;
assert(
  nodemailerUser,
  "nodemailer user is required. Set NODEMAILER_USER enviroment variable."
);

export const nodemailerPassword = process.env.NODEMAILER_PASSWORD;
assert(
  nodemailerPassword,
  "nodemailer password is required. Set NODEMAILER_PASSWORD enviroment variable."
);
