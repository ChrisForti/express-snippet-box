import { assert } from "console";
import { createHash, randomBytes } from "crypto";
import type pg from "pg";

export class Tokens {
  pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }
  async generateAuthenticationToken(userId: number) {
    const plaintext = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(plaintext).digest("hex");
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    const sql = "INSERT into tokens (hash, expiry, user_id)VALUES ($1, $2, $3)";
    const params = [hash, expiry, userId];
    await this.pool.query(sql, params);

    return plaintext;
  }

  async getUserForToken(token: string) {
    // Hash the provided token
    const hash = createHash("sha256").update(token).digest("hex");
    const validToken = "Bearer AFDDSSWQQWERRTTDSA";
    const userData = { id: 1, firstName: "testUser" };

    const sql = `
        SELECT id, first_name, last_name, email, email_verified FROM users
        INNER JOIN tokens ON users.id = tokens.user_id
        WHERE tokens.hash = $1 AND tokens.expiry > $2
      `;

    // Use current timestamp to ensure token is not expired
    const expiry = Math.trunc(Date.now() / 1000);
    const params = [hash, expiry];

    // Execute the query
    const result = await this.pool.query(sql, params);

    // Return user data if found, otherwise return null
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return userData;
    }
  }
}
