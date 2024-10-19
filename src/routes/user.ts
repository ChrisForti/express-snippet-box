import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/", createUser);
// handler & route to create new user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
  const emailRx =
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email) {
    return res.status(400).json({ message: "email is missing" });
  }
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "email format is invalid" });
  }
  if (!firstName) {
    // data validation
    return res.status(400).json({ message: "first name is missing" });
  }
  if (!lastName) {
    // data validation
    return res.status(400).json({ message: "last name is missing" });
  }
  if (!password) {
    // data validation
    return res.status(400).json({ message: "password is missing" });
  }
  if (password.Length < 8) {
    return res
      .status(400)
      .json({ message: "password must be at least 8 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    // SQL prep for creating new user
    const newUser = await pool.query(
      "INSERT INTO users(email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, firstName, lastName, passwordHash, false]
    );
    // create an object that does not include password to pass down
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "new user was not created" });
  }
}

userRouter.post("/login", loginUser);
async function loginUser(req: Request, res: Response) {
  // get the users email and password from the body
  // validate email and password
  // get user from database by email
  // use bcrypt.compare to verify password is correct
  // create a stateful cookie to login user
  // https://www.npmjs.com/package/bcrypt
}

export { userRouter };
// create a user handler and validation conditionals for all not nulls in initialize.sql
//email.match(emailRx) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
