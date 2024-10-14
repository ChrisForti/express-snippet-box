import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";

const userRouter = Router();

userRouter.post("/", createUser);
// handler & route to create new user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password, emailVerified } = req.body;
  const emailRx ="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
  if (!email.match(emailRx)) {
    //email.match https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    // data validation
    return res.status(400).json({ message: "email is missing." });
  }
  if (!firstName) {
    // data validation
    return res.status(400).json({ message: "password is missing." });
  }
  if (!lastName) {
    // data validation
    return res.status(400).json({ message: "password is missing." });
  }
  if (!password) {
    // data validation
    return res.status(400).json({ message: "password is missing." });
  }
  if (!emailVerified) {
    // data validation
    return res.status(400).json({ message: "email not verified." });
  }
  try {
    const newUser = await pool.query("INSERT INTO users(id, email, firstName, lastName, password, email_verified) VALUES ($1, $2, $3, $4) RETURNING *");
    res.status(201).json(newUser.rows[0])
  } catch (error) {
    console.error("error creating user:", error);
    throw error;
  }
}

export  { userRouter };
// create a user handler and validation conditrionals for all not nulls in initialize.sql
// figure out how to use this string mdn docs match or matches
//const emailRx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
