import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";
import { scope } from "../models/token-model.js";

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

  if (typeof token !== "string" || token.length !== 43) {
    return next();
  }

  try {
    // Use the token to get user data
    const user = await db.Models.Tokens.getUserForToken(
      token,
      scope.AUTHENTICATION
    );

    // Check if user data retrieval was successful
    if (!user) {
      return next();
    }
    req.user = user;
    next(); // Proceed to next middleware
  } catch (error) {
    console.error("Error during token authentication:", error);
    next();
  }
}
export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// access db in railway and add <scope text not null>
