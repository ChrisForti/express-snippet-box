import { db } from "../db/db.js";
import { Router } from "express";
import type { Request, Response } from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import {
  validateTitle,
  validateContent,
  validateExperationDate,
  validateId,
  validateSnippetId,
} from "../models/validators.js";

const snippetRouter = Router();

type SnippetControllerBodyParams = {
  title: string;
  content: string;
  expirationDate: string;
};

snippetRouter.post("/", ensureAuthenticated, createSnippet);
snippetRouter.get("/all/:userId", getAllSnippetsByUserId);
snippetRouter.get("/:snippetId ", getBySnippetId);
snippetRouter.put("/:snippetId", ensureAuthenticated, updateSnippet);
snippetRouter.delete("/:snippetId", ensureAuthenticated, deleteSnippet);

async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate } =
    req.body as SnippetControllerBodyParams;
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const userId = req.user.id;

  try {
    validateTitle(title);

    validateContent(content);

    validateExperationDate(expirationDate);

    validateId(userId);

    const snippet = await db.Models.Snippets.createSnippet(
      title,
      content,
      expirationDate,
      userId
    );
    res.status(201).json({ snippet });
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

async function getBySnippetId(req: Request, res: Response) {
  const { snippetId } = req.params;

  try {
    validateSnippetId(snippetId);

    const snippet = await db.Models.Snippets.getSnippetById(
      parseInt(snippetId!)
    );
    res.json(snippet.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to retrieve snippets" });
  }
}

// TODO this method is wrong
async function getAllSnippetsByUserId(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    validateId(userId);

    const snippets = await db.Models.Snippets.getAllSnippetsByUserId(userId);
    if (!snippets || snippets.length === 0) {
      return res
        .status(404)
        .json({ message: "No snippets found for this user" });
    }

    res.json(snippets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to retrieve snippets" });
    if (error instanceof Error && error.message === "Snippets not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve snippets" });
    }
  }
}

async function updateSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;

  const { title, content, expirationDate } =
    req.body as SnippetControllerBodyParams;

  try {
    validateSnippetId(snippetId);

    const updateSnippet = await db.Models.Snippets.updateSnippet(
      snippetId!,
      title,
      content,
      expirationDate
    );

    res.json(updateSnippet.rows);
    res.status(200).send("snippet updated successfully");
  } catch (error) {
    console.error("error updating snippet:", error);
    res.status(500).send("failed to update snippet");
  }
}

async function deleteSnippet(req: Request, res: Response) {
  const { snippetId } = req.body;
  const userId = req.user!.id;

  try {
    validateSnippetId(snippetId);
    const deleteSnippet = await db.Models.Snippets.deleteSnippetBySnippetId(
      snippetId,
      userId
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
