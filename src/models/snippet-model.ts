import type pg from "pg";
import assert from "assert";
import {
  validateContent,
  validateExperationDate,
  validateId,
  validateTitle,
} from "./validators.js";

type SnippetModel = {
  tile: string;
  content: string;
  expirationDate: number;
  userId: number;
  snippetId: number;
};

export class Snippets {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
  async createSnippet(
    title: string,
    content: string,
    expirationDate: string,
    userId: number
  ) {
    try {
      validateTitle(title);

      validateContent(content);

      validateExperationDate(expirationDate);

      validateId(userId);

      const sql =
        "INSERT INTO snippets (title, expiration_date, user_id, content) VALUES ($1, $2, $3, $4) RETURNING id";
      const params = [title, expirationDate, userId, content];
      const newSnippet = await this.pool.query(sql, params);

      return {
        id: newSnippet.rows[0].id,
        title,
        expirationDate,
        userId,
        content,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // needs a get by snippet id, and update. refactor my snippetid to a string, because of uuid.
  // Also only have validators in my model
  async getSnippetById(snippetId: number) {
    try {
      validateId(snippetId);

      const sql = "SELECT * FROM snippets WHERE snippet_id = $1";
      const result = await this.pool.query(sql, [snippetId]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAllSnippetsByUserId(userId: number) {
    try {
      validateId(userId);

      const sql = "SELECT * FROM snippets WHERE user_id = $1";

      const result = await this.pool.query(sql, [userId]);

      return result.rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async deleteSnippetBySnippetId(snippetId: number) {
    const sql = "DELETE FROM snippets WHERE id = $1";

    try {
      validateId(snippetId);
      const result = await this.pool.query(sql, [snippetId]);
      if (result.rowCount === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

// Create a model here like the other models.
