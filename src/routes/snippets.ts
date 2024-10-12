import { error } from "console";
import { pool } from "../db/db.js";
import { Router } from "express";
import type { Request, Response } from "express";

const snippetRouter = Router();

// Function handler to create a new snippet
snippetRouter.post("/", createSnippet);

async function createSnippet(req: Request, res: Response) {
  const { title, content, expiration_date, user_id } = req.body;
  if (!title) {
    return res.status(400).json({ message: "title is missing." });
  }

  if (!user_id) {
    return res.status(400).json({ message: "user_id is missing." });
  }
  if (isNaN(parseInt(user_id))) {
    return res.status(400).json({ message: "user_id must be a number" });
  }

  if (expiration_date && isNaN(parseInt(expiration_date))) {
    return res
      .status(400)
      .json({ message: "experation_date must be a number" });
  }

  if (!content) {
    return res.status(400).json({ message: "content is missing." });
  }

  try {
    await pool.query(
      "INSERT INTO snippets (title, expiration_date, user_id, content) VALUES ($1, $2, $3, $4)",
      [title, expiration_date, user_id, content]
    );
  } catch (error) {
    console.error("Error creating snippet:", error);
    throw error;
  }
  if (error instanceof Error) {
    if ("code" in error && error.code === "23503") {
      res.status(400).json({ message: "Invalid user_id provided" });
    } else {
      res.status(500).json({ message: "Failed to create snippet" });
    }
  }
}

// Function handler to read/get a snippet

// Function to update a snippet
snippetRouter.put("/", updateTitle);

async function updateTitle(req: Request, res: Response) {
  const { id, newTitle } = req.body;
  try {
    const sql = `
    UPDATE snippets 
    SET title = $1 
    WHERE id = $2`;
    const args = [newTitle, id];
    await pool.query(sql, args);
    res.status(200).send("Snippet title updated successfully");
  } catch (error) {
    console.error("Error updating snippet title:", error);
    res.status(500).send("Failed to update snippet title");
  }
}
// Functn to delete a snippet
snippetRouter.delete("/:snippet_id", deleteSnippet);

async function deleteSnippet(req: Request, res: Response) {
  const { snippet_id } = req.body; //destructure to get snippet_id
  if (!snippet_id) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id is missing" });
  }
  if (isNaN(parseInt(snippet_id))) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id must be a number" });
  }
  try {
    const deletedSnippet = await pool.query(
      "DELETE FROM snippets WHERE snippet_id = $1 RETURNING *",
      [snippet_id]
    );
    if (deletedSnippet.rows.length === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.json({ message: "snippet successfully deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to delete snippet" });
  }
}
export { snippetRouter };
