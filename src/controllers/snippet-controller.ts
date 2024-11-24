import { db, pool } from "../db/db.js";
import { Router } from "express";
import type { Request, Response } from "express";
import { ensureAuthenticated } from "./auth.js";

const snippetRouter = Router();

type SnippetControllerBodyParams = {
  title: string;
  content: string;
  expirationDate: string;
  userId: string;
  snippetId: string;
};

snippetRouter.post("/", ensureAuthenticated, createSnippet);
// Function controller to create a new snippet
async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate, userId } =
    req.body as SnippetControllerBodyParams;

  try {
    const plaintext = await db.Models.Snippets.createSnippet(
      title,
      content,
      expirationDate,
      parseInt(userId)
    );
  } catch (error) {
    console.error("error creating snippet:", error);
    if (error instanceof Error) {
      if ("code" in error && error.code) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        res.status(500).json({ message: "failed to create snippet" });
      }
    }
  }
}

snippetRouter.get("/all/:userId", getAllSnippetsByUserId);
// Function controller to read/get a snippet
async function getAllSnippetsByUserId(req: Request, res: Response) {
  const { userId } = req.params as SnippetControllerBodyParams;

  try {
    const snippet = await pool.query(
      "SELECT * FROM snippets WHERE userId = $1",
      [userId]
    );
    res.json(snippet.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to retrieve snippets" });
  }
}

snippetRouter.put("/:snippetId", ensureAuthenticated, updateSnippet);
// Function controller to update a snippet
async function updateSnippet(req: Request, res: Response) {
  const { snippetId } = req.params as SnippetControllerBodyParams;

  const { title, content, expirationDate } =
    req.body as SnippetControllerBodyParams;

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
      expirationDate ?? snippet.expiration_date,
      snippetId,
    ];
    const result = await pool.query(sql, args);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.json(result.rows[0]);
    }
    res.status(200).send("snippet title updated successfully");
  } catch (error) {
    console.error("error updating snippet:", error);
    res.status(500).send("failed to update snippet");
  }
}

snippetRouter.delete("/:snippetId", ensureAuthenticated, deleteSnippet);
// Function to delete a snippet
async function deleteSnippet(req: Request, res: Response) {
  const { snippetId } = req.body; // get snippetId

  try {
    const deleteSnippet = await db.Models.Snippets.deleteSnippetBySnippetId(
      snippetId
    );

    if (!deleteSnippet) {
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
// verify snippet or snippets
