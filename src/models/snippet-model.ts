import type pg from "pg";
import assert from "assert";

type SnippetModel = {
  tile: string;
  content: string;
  expirationDate: string;
  userId: number;
  snippetId: number;
};

export class snippet {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
  async createSnippet() {}
}

// Create a model here like the other models.
