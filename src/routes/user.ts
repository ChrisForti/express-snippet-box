import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";

const userRouter = Router();

userRouter.post("/", createUser);
// handler & route to create new user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password, emailVerified } = req.body;
  const emailRx =
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ msg: "email format is invalid" });
  }
  if (!email) {
    return res.status(400).json({ msg: "email is missing" });
  }
  if (!firstName) {
    // data validation
    return res.status(400).json({ msg: "first name is missing" });
  }
  if (!lastName) {
    // data validation
    return res.status(400).json({ msg: "last name is missing" });
  }
  if (!password) {
    // data validation
    return res.status(400).json({ msg: "password is missing" });
  }
  if (!emailVerified) {
    // data validation
    return res.status(400).json({ msg: "email could not be verified" });
  }

  try {
    // SQL prep for creating new user
    const newUser = await pool.query(
      "INSERT INTO users(id, email, firstName, lastName, password, email_verified) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, firstName, lastName, password]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "new user was not created" });
  }
}

export { userRouter };
// create a user handler and validation conditionals for all not nulls in initialize.sql
//email.match(emailRx) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
