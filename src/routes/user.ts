import { Router } from "express";
import { pool } from "../db/db.js";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { validateEmail } from "../models/validator.js";

const userRouter = Router();

userRouter.post("/", createUser);

type CreateUserBodyParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Route controller to create a user
async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } =
    req.body as CreateUserBodyParams;

  try {
    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); // 201 = created newUser
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: "Bad request" }); // More specific pattern
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}

userRouter.post("/login", loginUser);

type loginUserBodyParams = {
  email: string;
  password: string;
};

// Route handler to login users
async function loginUser(req: Request, res: Response) {
  // get the users email and password from the body
  const { email, password: passwordHash } = req.body as loginUserBodyParams;

  if (!passwordHash) {
    return res.status(400).json({ message: "password is missing" });
  }

  if (passwordHash.length < 8 || passwordHash.length > 500) {
    return res
      .status(400)
      .json({ message: "password must be between 8, and 500 characters" });
  }

  // get user from database by email
  try {
    validateEmail(email);
    const getUserByEmail = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(getUserByEmail, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    const user = result.rows[0];

    // use bcrypt.compare to verify password is correct
    // https://www.npmjs.com/package/bcrypt
    const verifiedPassword = await bcrypt.compare(passwordHash, user.password);

    if (!verifiedPassword) {
      return res.status(401).json({ message: "Credentials invalid" });
    }

    const plaintext = db.Models.Tokens.generateAuthenticationToken(user.id);

    res
      .status(200)
      .json({ message: "User retrieved successfully", token: plaintext });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// research middleware
// https://www.usebruno.com/
// MVC model view controller

export { userRouter };
