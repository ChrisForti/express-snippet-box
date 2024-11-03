import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";

type UserModel = {
  id: number;
  name: string;
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
      // combine first and last into name? and validate
      const name = `${firstName} ${lastName}`;
      if (!name) {
        throw new Error("invalid name");
      }

      // validate email
      const emailRx =
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

      if (!email) {
        throw new Error("email address is required");
      }
      if (!email.match(emailRx)) {
        throw new Error("invalid email format");
      }

      // verify password and format
      if (password === null) {
        throw new Error("Invalid password. Password is required");
      }
      if (password.length < 8 || password.length > 500) {
        throw new Error(
          "invalid password format, must be between 8 and 500 characters"
        );
      }
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
      const params = [name, email, passwordHash];
      const client = await this.pool.query(sql, params);
      // if (client.rows.length != 1) {
      //   throw new Error("new user was not created");
      // }

      // create user to return
      return {
        id: client.rows[0].id,
        name,
        email,
        passwordHash,
        createdAt: client.rows[0].created_at,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create a new user. See logs for details.");
    }
  }
}
