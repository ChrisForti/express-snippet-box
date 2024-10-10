import { error } from "console";
import { pool } from "../db/db.js";
import { Router } from "express";

const snippetRouter = Router();

// Function handler to insert a new snippet
snippetRouter.post("/", async (req, res) => {
  const { title, content, expiration_date, user_id } = req.body;
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
});

// Function to update a snippet's title
snippetRouter.put("/", async (req, res) => {
  const { id, newTitle } = req.body;
  try {
    await pool.query(id, newTitle);
    res.status(200).send("Snippet title updated successfully");
  } catch (error) {
    console.error("Error updating snippet title:", error);
    res.status(500).send("Failed to update snippet title");
  }
});
// Function to delete a snippet by ID
export const deleteSnippet = async (id: string) => {
  try {
    await pool.query("DELETE FROM snippets WHERE snippet_id = $1", [id]);
  } catch (error) {
    console.error("Error deleting snippet:", error);
    throw error;
  }
  // Route handler function for deleting a snippet
  snippetRouter.delete("/", async (req, res) => {
    const id = req.params;

    try {
      await deleteSnippet(id);
      res.status(200).send("Snippet deleted successfully");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      res.status(500).send("Failed to delete snippet");
    }
  });
};
