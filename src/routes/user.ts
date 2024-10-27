import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/", createUser);
// Route handler to create a user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
  const emailRx = //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email) {
    return res.status(400).json({ message: "email is missing" });
  }
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "email format is invalid" });
  }
  if (!firstName) {
    return res.status(400).json({ message: "first name is missing" });
  }
  if (!lastName) {
    return res.status(400).json({ message: "last name is missing" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is missing" });
  }
  if (password.Length < 8) {
    return res
      .status(400)
      .json({ message: "password must be at least 8 characters" });
  }

  // create an object that does not include password to pass down
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    if (passwordHash === null) {
      throw new Error("something went wrong inserting password");
    }

    // SQL prep for creating new user
    const newUser = await pool.query(
      "INSERT INTO users(email, first_name, last_name, passwordHash, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    );
    if (passwordHash === null) {
      throw new Error("something went wrong inserting user");
    }

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "new user was not created" });
  }
}

userRouter.post("/login", loginUser);
// Route handler to login users
async function loginUser(req: Request, res: Response) {
  // get the users email and password from the body
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is missing" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is missing" });
  }
  // validate email and password
  const emailRx = //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "email format is invalid" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password must be at least 8 characters" });
  }
  // get user from database by email
  try {
    const getUserByEmail =
      "SELECT user_id, email, password FROM users WHERE email = $1";
    const result = await pool.query(getUserByEmail, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    const user = result.rows[0];

    // use bcrypt.compare to verify password is correct
    // https://www.npmjs.com/package/bcrypt
    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // create a stateful cookie to login user
    // (I used cookieparser)
    // https://www.npmjs.com/package/cookieparser
    res.cookie("user_id", user.id, { maxAge: 900000, httpOnly: true });
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { userRouter };
// create a user handler and validation conditionals for all not nulls in initialize.sql
//email.match(emailRx) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
