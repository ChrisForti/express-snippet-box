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
      const newSnippet = await this.pool.query(sql, params);

      return {
        title,
        expirationDate,
        userId: newSnippet.rows[0].userId,
        content,
      };
    } catch (error) {
      throw new Error("Error creating snippet");
    }
  }
  async getAllSnippetsByUserId(userId: string) {
    const sql = "SELECT * FROM snippets WHERE userId = $1";
    const result = await this.pool.query(sql, [userId]);
    if (result.rows.length === 0) {
      throw new Error("user id not found");
    }
    const snippets = result.rows[0] as SnippetModel;
    return snippets;
  }

async deleteSnippetBySnippetId (snippetId: string){
  const sql = "DELETE FROM snippets WHERE id = $1 RETURNING *"
  const result = await this.pool.query(sql, [snippetId])
  
  try {  
if (result.rows.length === 0) {
  throw new Error("snippet not found")
} else {
  return "Snippet deleted successfully"
}
} catch (error) {
  throw new Error("error deleteing specified snippet")
  }
}



// Create a model here like the other models.
