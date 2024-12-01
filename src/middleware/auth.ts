import type { Request, Response, NextFunction } from "express";

async function getUserByToken(
  token: string
): Promise<{ id: number; username: string } | null> {
  // Example implementation; replace with actual database logic
  const validToken = "example_valid_token_of_43_characters_abcdefghij";
  const userData = { id: 1, username: "testUser" };

  return token === validToken ? userData : null;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ error: "No credentials provided" });
    req.user = null;
  } else {
    // TODO
    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid authorization format" });
    }
    // Get the second element in the array, which is the token
    const token = parts[1];

    // Check that the token is exactly 43 characters long
    //   if (token.length !== 43) {
    //     return res.status(401).json({ error: "Invalid token length" });
    //   }
  }
  next();
}
// get second piece of the token (token: "Bearer AFDDSSWQQWERRTTDSA")
