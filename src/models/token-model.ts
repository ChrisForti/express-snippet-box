import { createHash, randomBytes } from "crypto";
import type pg from "pg";

export class Tokens {
  pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }
  async generateAuthenticationToken(userId: number) {
    const plaintext = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(plaintext).digest("hex");
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    const sql = "INSERT into tokens (hash, epiry, user_id)VALUES ($1, $2, $3)";
    const params = [hash, expiry, userId];
    await this.pool.query(sql, params);

    return plaintext;
  }
}
