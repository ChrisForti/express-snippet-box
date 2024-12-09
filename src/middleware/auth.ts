import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";

type tokenParams = {
  token: string;
};

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Ensure req.user is initially null
  req.user = null;

  const authorizationHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authorizationHeader) {
    return next();
  }

  // Split Authorization header into parts and ensure proper format
  const parts = authorizationHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  // Extract the token and validate its length
  const token = parts[1];

  if (!token) {
    //(typeof token !== "string")
    return next();
  }

  if (token.length !== 43) {
    return next();
  }

  try {
    // Use the token to get user data
    const user = await db.Models.Tokens.getUserForToken(token);

    // Check if user data retrieval was successful
    if (!user) {
      return next();
    }
    req.user = user;
    next(); // Proceed to next middleware
  } catch (error) {
    console.error("Error during token authentication:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}
// get second piece of the token (token: "Bearer AFDDSSWQQWERRTTDSA")
