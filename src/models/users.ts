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
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      validateName(firstName, lastName);

      validateEmail(email);

      validatePassword(password);

      // hash password then check for a falsy password hash
      const passwordHash = await bcrypt.hash(password, 10);
      if (!passwordHash) {
        throw new Error("Error hashing the password");
      }

      // sql and params prep and verify
      const sql = // RETURNING clause to return those values automatically
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [firstName, lastName, email, passwordHash];
      const client = await this.pool.query(sql, params);

      // create user to return
      return {
        id: client.rows[0].id,
        firstName,
        lastName,
        email,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
  async getUserByEmail(email: string) {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await this.pool.query(sql, [email]);
    if (result.rows.length === 0) {
      throw new Error("user not found");
    }
    const user = result.rows[0] as UserModel;
    return user;
  }
}
