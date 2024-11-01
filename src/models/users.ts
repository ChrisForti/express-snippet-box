import type pg from "pg";
import bcrypt from "bcrypt";

type UserModel = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      // combine first and last into name? and validate
      const name = { firstName, lastName };
      if (!name) {
        throw new Error("invalid name");
      }

      // verify email
      const emailRx =
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
      if (!email) {
        throw new Error("invalid email");
      }
      if (!email.match(emailRx)) {
        throw new Error("invalid email format");
      }

      // verify password
      const passwordHash = await bcrypt.hash(password, 10);
      if (passwordHash === null) {
        throw new Error("something went wrong inserting password");
      }
      if (passwordHash.length < 8 || passwordHash.length > 500) {
        throw new Error(
          "invalid password format, must be between 8 and 500 characters"
        );
      }

      // sql and params prep and verify
      const sql =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [name, email, passwordHash];
      const client = await this.pool.query(sql, params);
      if (client.rows.length != 1) {
        throw new Error("new user was not created");
        return null;
      }
    } catch (error) {
      throw new Error("new user was not created");
    }
  }
}
