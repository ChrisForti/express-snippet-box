import type pg from "pg";
import assert from "assert";
import {
  validateContent,
  validateExperationDate,
  validateTitle,
  validateUserId,
} from "./validators.js";

type SnippetModel = {
  tile: string;
  content: string;
  expirationDate: number;
  userId: number;
  snippetId: number;
};

export class snippet {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
  async createSnippet(
    title: string,
    content: string,
    expirationDate: string,
    userId: string
  ) {
    try {
      validateTitle(title);

      validateContent(content);

      validateExperationDate(expirationDate);

      validateUserId(userId);

      const sql =
        "INSERT INTO snippets (title, expiration_date, user_id, content) VALUES ($1, $2, $3, $4)";
      const params = [title, content, expirationDate, userId];
      const client = await this.pool.query(sql, params);

      return {
        content,
      };
    } catch (error) {
      throw new Error("Error creating snippet");
    }
  }
}

// Create a model here like the other models.
