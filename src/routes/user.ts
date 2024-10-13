import { Router } from "express";
import type { Request, Response } from "express";

const userRouter = Router();

userRouter.post("/", createUser);
async function createUser(req: Request, res: Response) {
  const { email, password, email_verified } = req.body;
  if (!email) {
    // data validation
    return res.status(400).json({ message: "email is missing." });
  }
  if (!password) {
    // data validation
    return res.status(400).json({ message: " is missing." });
  }
  if (!email_verified) {
    // data validation
    return res.status(400).json({ message: "title is missing." });
  }
}

export { userRouter };
// create a user handler and validation conditrionals for all not nulls in initialize.sql
// figure out how to use this string mdn docs match or matches
//const emailRx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
