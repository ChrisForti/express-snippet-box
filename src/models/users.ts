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

  async createUser(name: string, email: string, password: string) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      if (passwordHash === null) {
        throw new Error("something went wrong inserting password");
      }

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
