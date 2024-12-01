import pg from "pg";
import { Users } from "../models/user-model.js";
import { Tokens } from "../models/token-model.js";
import { Snippets } from "../models/snippet-model.js";
import { connectionString } from "../constants.js";

const { Pool } = pg;

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Tokens: new Tokens(pool),
    Users: new Users(pool),
    Snippets: new Snippets(pool),
  },
};
