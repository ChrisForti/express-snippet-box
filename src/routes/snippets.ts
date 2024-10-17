import { error } from "console";
import { pool } from "../db/db.js";
import { Router } from "express";
import type { Request, Response } from "express";

const snippetRouter = Router();

snippetRouter.post("/", createSnippet);
// Function handler to create a new snippet
async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate, userId } = req.body;
  if (!title) {
    // data validation
    return res.status(400).json({ msg: "title is missing." });
  }
  if (!userId) {
    // data validation
    return res.status(400).json({ msg: "user id is missing." });
  }
  if (isNaN(parseInt(userId))) {
    // data validation
    return res.status(400).json({ msg: "user id must be a number" });
  }
  if (expirationDate && isNaN(parseInt(expirationDate))) {
    // data validation
    return res.status(400).json({ msg: "experation_date must be a number" });
  }
  if (!content) {
    return res.status(400).json({ msg: "content is missing." });
  }

  try {
    await pool.query(
      "INSERT INTO snippets (title, expiration_date, user_id, content) VALUES ($1, $2, $3, $4)",
      [title, expirationDate, userId, content]
    );
  } catch (error) {
    console.error("error creating snippet:", error);
    throw error;
  }
  if (error instanceof Error) {
    if ("code" in error && error.code) {
      res.status(400).json({ msg: "invalid user id" });
    } else {
      res.status(500).json({ msg: "failed to create snippet" });
    }
  }
}

snippetRouter.get("/all/:userId", getAllSnippetsByUserId);
// Function handler to read/get a snippet
async function getAllSnippetsByUserId(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId) {
    // data validation
    return res.status(400).json({ msg: "user id is missing" });
  }
  if (!userId || isNaN(parseInt(userId))) {
    // data validation
    return res.status(400).json({ msg: "user id must be a number" });
  }

  try {
    const snippet = await pool.query(
      "SELECT * FROM snippets WHERE userId = $1",
      [userId]
    );
    res.json(snippet.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "failed to retrieve snippets" });
  }
}

snippetRouter.put("/:snippetId", updateSnippet);
// Function handler to update a snippet
async function updateSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;
  if (!snippetId) {
    // data validation
    return res.status(400).json({ msg: "snippet id is missing" });
  }
  if (isNaN(parseInt(snippetId))) {
    // data validation
    return res.status(400).json({ msg: "snippet id must be a number" });
  }

  const { title, content, expiration_date } = req.body;
  if (expiration_date && isNaN(parseInt(expiration_date))) {
    // data validation
    return res.status(400).json({ msg: "expiration_date must be a number" });
  }

  try {
    const snippet = (
      await pool.query("select from snippets where id = $1", [snippetId])
    ).rows[0];
    const sql = `
    UPDATE snippets
    SET title = $1, content = $2, expiration_date = $3
    WHERE snippetId = $4
    `;
    const args = [
      title ?? snippet.title,
      content ?? snippet.content,
      expiration_date ?? snippet.expiration_date,
      snippetId,
    ];
    const result = await pool.query(sql, args);
    if (result.rows.length === 0) {
      res.status(404).json({ msg: "snippet not found" });
    } else {
      res.json(result.rows[0]);
    }
    res.status(200).send("snippet title updated successfully");
  } catch (error) {
    console.error("error updating snippet:", error);
    res.status(500).send("failed to update snippet");
  }
}

snippetRouter.delete("/:snippetId", deleteSnippet);
// Function to delete a snippet
async function deleteSnippet(req: Request, res: Response) {
  const { snippetId } = req.body; // get snippetId
  if (!snippetId) {
    // data validation
    return res.status(400).json({ msg: "snippet id is missing" });
  }
  if (isNaN(parseInt(snippetId))) {
    // data validation
    return res.status(400).json({ msg: "snippet id must be a number" });
  }

  try {
    const deletedSnippet = await pool.query(
      "DELETE FROM snippets WHERE id = $1 RETURNING *",
      [snippetId]
    );
    if (deletedSnippet.rows.length === 0) {
      res.status(404).json({ msg: "snippet not found" });
    } else {
      res.json({ msg: "snippet successfully deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "failed to delete snippet" });
  }
}
export { snippetRouter };
// verify snippet or snippets
