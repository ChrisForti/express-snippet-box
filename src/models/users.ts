import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";
import { validateEmail, validateName, validatePassword } from "./validator.js";

type UserModel = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection pool is required"); // validates pool object and stops function if not right
    this.pool = pool;
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<UserModel | null> {
    try {
      validateName(firstName, lastName);

      validateEmail(email);

      validatePassword(password);

      // hash password
      const passwordHash = await bcrypt.hash(password, 10);

      if (!passwordHash) {
        // check for a falsy password hash
        throw new Error("Error hashing the password");
      }

      // sql and params prep and verify
      // using the RETURNING clause to return those values automatically
      const sql =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [firstName, lastName, email, passwordHash];
      const client = await this.pool.query(sql, params);

      // create user to return
      return {
        id: client.rows[0].id,
        firstName,
        lastName,
        email,
        passwordHash,
        createdAt: client.rows[0].created_at,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      // throw new Error("Failed to create a new user. See logs for details.");
      return null;
    }
  }
}
