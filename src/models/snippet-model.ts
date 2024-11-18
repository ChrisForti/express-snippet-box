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
      validateUserId(userId);
    } catch (error) {}
  }
}

// Create a model here like the other models.
