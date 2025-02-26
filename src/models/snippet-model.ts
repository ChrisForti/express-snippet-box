import type pg from "pg";
import assert from "assert";

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

  async getSnippetById(snippetId: number) {
    try {
      const sql = "SELECT * FROM snippets WHERE snippet_id = $1";

      const result = await this.pool.query(sql, [snippetId]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAllSnippetsByUserId(userId: number) {
    if (userId === null || userId === undefined) {
      throw new Error("userId is missing");
    }
    if (typeof userId !== "number") {
      userId = parseInt(userId as string);
    }
    try {
      const sql = "SELECT * FROM snippets WHERE user_id = $1";

      const result = await this.pool.query(sql, [userId]);

      return result.rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async updateSnippet(
    snippetId: string,
    title: string,
    content: string,
    expirationDate: string
  ) {
    try {
      // Retrieve the existing snippet to get default field values if needed
      const snippetQuery = `
      SELECT title, content, expiration_date 
      FROM snippets 
      WHERE snippet_id = $1`;

      // Then process the query plus any default field values
      const snippet = (await this.pool.query(snippetQuery, [snippetId]))
        .rows[0];
      const sql = `
      UPDATE snippets
      SET title = $1, content = $2, expiration_date = $3
      WHERE snippet_id = $4`;

      const args = [
        snippetId,
        title ?? snippet.title,
        content ?? snippet.content,
        expirationDate ?? snippet.expiration_date,
      ];

      const updateResult = await this.pool.query(sql, args);
      if (updateResult.rows.length === 0) {
        console.error("Snippet not found");
      } else {
        return updateResult.rows[0];
      }
    } catch (error) {
      console.error(error);
      return "snippet updated successfully";
    }
  }

  async deleteSnippetBySnippetId(snippetId: number, userId: number) {
    const sql = "DELETE FROM snippets WHERE id = $1 and user_id = $2";

    try {
      const result = await this.pool.query(sql, [snippetId, userId]);
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
